import { useState, useRef, useEffect } from "react";
import { Link } from "wouter";
import {
  UtensilsCrossed, Plus, Pencil, Trash2, X, Check,
  ImageOff, LogOut, AlertTriangle, ChevronRight,
} from "lucide-react";
import { useAdminMenu, type AdminCategory, type AdminDish } from "@/store/use-admin-menu";
import { cn } from "@/lib/utils";

const CATEGORIES: AdminCategory[] = ["Appetizer", "Main Course", "Drink"];

const CAT_STYLE: Record<AdminCategory, string> = {
  Appetizer:    "bg-amber-100  text-amber-700  border-amber-200",
  "Main Course":"bg-orange-100 text-orange-700 border-orange-200",
  Drink:        "bg-blue-100   text-blue-600   border-blue-200",
};

const BLANK = {
  name:        "",
  description: "",
  price:       "",
  category:    "Main Course" as AdminCategory,
  imageUrl:    "",
};

type FormState = typeof BLANK;
type FormErrors = Partial<Record<keyof FormState, string>>;

export default function Admin() {
  const { dishes, addDish, updateDish, deleteDish } = useAdminMenu();

  const [form,        setForm       ] = useState<FormState>(BLANK);
  const [errors,      setErrors     ] = useState<FormErrors>({});
  const [editingId,   setEditingId  ] = useState<string | null>(null);
  const [deletingId,  setDeletingId ] = useState<string | null>(null);
  const [toast,       setToast      ] = useState<{ msg: string; type: "ok" | "del" } | null>(null);
  const [newRowId,    setNewRowId   ] = useState<string | null>(null);

  const tableRef = useRef<HTMLDivElement>(null);
  const nameRef  = useRef<HTMLInputElement>(null);

  /* toast helper */
  const showToast = (msg: string, type: "ok" | "del" = "ok") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  /* field updater */
  const setField = <K extends keyof FormState>(key: K, val: FormState[K]) => {
    setForm((f) => ({ ...f, [key]: val }));
    setErrors((e) => ({ ...e, [key]: undefined }));
  };

  /* validation */
  const validate = (): boolean => {
    const e: FormErrors = {};
    if (!form.name.trim())  e.name  = "Dish name is required";
    if (!form.price.trim() || isNaN(Number(form.price)) || Number(form.price) <= 0)
      e.price = "Enter a valid price greater than 0";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  /* submit */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const payload = {
      name:        form.name.trim(),
      description: form.description.trim(),
      price:       Number(form.price),
      category:    form.category,
      imageUrl:    form.imageUrl.trim(),
    };

    if (editingId) {
      updateDish(editingId, payload);
      showToast("✅ Dish updated successfully!");
      setEditingId(null);
    } else {
      addDish(payload);
      /* find the newly created dish id to highlight it */
      const tempId = `highlight-${Date.now()}`;
      setNewRowId(tempId);
      showToast("✅ New dish added to menu!");
    }

    setForm(BLANK);
    setErrors({});

    /* scroll table into view after add */
    setTimeout(() => {
      tableRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  };

  /* edit: populate form */
  const handleEdit = (dish: AdminDish) => {
    setEditingId(dish.id);
    setForm({
      name:        dish.name,
      description: dish.description,
      price:       String(dish.price),
      category:    dish.category,
      imageUrl:    dish.imageUrl,
    });
    setErrors({});
    setDeletingId(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
    setTimeout(() => nameRef.current?.focus(), 350);
  };

  /* cancel edit */
  const cancelEdit = () => {
    setEditingId(null);
    setForm(BLANK);
    setErrors({});
  };

  /* delete */
  const handleDelete = (id: string) => {
    if (deletingId === id) {
      deleteDish(id);
      setDeletingId(null);
      showToast("Dish removed from menu.", "del");
      if (editingId === id) cancelEdit();
    } else {
      setDeletingId(id);
    }
  };

  /* clear new-row highlight after animation */
  useEffect(() => {
    if (!newRowId) return;
    const t = setTimeout(() => setNewRowId(null), 2500);
    return () => clearTimeout(t);
  }, [newRowId]);

  /* stats */
  const counts = {
    total:     dishes.length,
    appetizer: dishes.filter((d) => d.category === "Appetizer").length,
    main:      dishes.filter((d) => d.category === "Main Course").length,
    drink:     dishes.filter((d) => d.category === "Drink").length,
  };

  /* newest dish id (for highlight) */
  const newestId = dishes.length > 0
    ? dishes.reduce((a, b) => (a.createdAt > b.createdAt ? a : b)).id
    : null;

  return (
    <div className="min-h-screen bg-gray-50">

      {/* ── Header ─────────────────────────────────────────────── */}
      <header className="sticky top-0 z-30 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center shadow-md shadow-primary/20">
              <UtensilsCrossed size={18} className="text-white" />
            </div>
            <div>
              <p className="font-extrabold text-foreground leading-none">Afro Foods</p>
              <p className="text-[11px] text-muted-foreground font-medium">Admin · Manage Menu</p>
            </div>
          </div>
          <Link href="/" className="flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline">
            <LogOut size={15} /> Back to Site
          </Link>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-6">

        {/* ── Stats ──────────────────────────────────────────────── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: "Total Dishes",  val: counts.total,     col: "text-primary",   bg: "bg-orange-50 border-orange-100" },
            { label: "Appetizers",    val: counts.appetizer, col: "text-amber-600", bg: "bg-amber-50  border-amber-100"  },
            { label: "Main Courses",  val: counts.main,      col: "text-orange-600",bg: "bg-orange-50 border-orange-100" },
            { label: "Drinks",        val: counts.drink,     col: "text-blue-600",  bg: "bg-blue-50   border-blue-100"   },
          ].map((s) => (
            <div key={s.label} className={cn("rounded-2xl border p-4 shadow-sm", s.bg)}>
              <p className={cn("text-3xl font-extrabold tabular-nums", s.col)}>{s.val}</p>
              <p className="text-sm text-muted-foreground mt-0.5 font-medium">{s.label}</p>
            </div>
          ))}
        </div>

        {/* ── Toast ──────────────────────────────────────────────── */}
        {toast && (
          <div className={cn(
            "flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold border",
            toast.type === "ok"
              ? "bg-green-50 border-green-200 text-green-700"
              : "bg-red-50 border-red-200 text-red-700"
          )}>
            <Check size={15} className="shrink-0" />
            {toast.msg}
          </div>
        )}

        {/* ── Form ───────────────────────────────────────────────── */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">

          {/* Form header */}
          <div className={cn(
            "px-6 py-4 border-b border-gray-100 flex items-center justify-between",
            editingId ? "bg-amber-50" : "bg-orange-50/60"
          )}>
            <h2 className="font-bold text-foreground flex items-center gap-2">
              {editingId
                ? <><Pencil size={16} className="text-amber-600" /> Edit Dish</>
                : <><Plus   size={16} className="text-primary"   /> Add New Dish</>}
            </h2>
            {editingId && (
              <button onClick={cancelEdit} className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors">
                <X size={13} /> Cancel edit
              </button>
            )}
          </div>

          {/*
            IMPORTANT: noValidate prevents the browser from blocking submission
            with its own URL / required checks. We handle all validation ourselves.
          */}
          <form onSubmit={handleSubmit} noValidate className="p-6 space-y-5">

            {/* Row 1: Name */}
            <div>
              <label className="block text-sm font-semibold text-foreground mb-1.5">
                Dish Name <span className="text-red-500">*</span>
              </label>
              <input
                ref={nameRef}
                type="text"
                placeholder="e.g. Peppered Chicken"
                value={form.name}
                onChange={(e) => setField("name", e.target.value)}
                className={cn(
                  "w-full px-4 py-2.5 rounded-xl border text-sm outline-none transition-all",
                  errors.name
                    ? "border-red-400 bg-red-50 ring-2 ring-red-200"
                    : "border-gray-200 bg-gray-50 focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/20"
                )}
              />
              {errors.name && (
                <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                  <AlertTriangle size={11} /> {errors.name}
                </p>
              )}
            </div>

            {/* Row 2: Description */}
            <div>
              <label className="block text-sm font-semibold text-foreground mb-1.5">
                Description <span className="text-muted-foreground font-normal text-xs">(optional)</span>
              </label>
              <textarea
                rows={2}
                placeholder="Brief description of the dish…"
                value={form.description}
                onChange={(e) => setField("description", e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/20 text-sm outline-none transition-all resize-none"
              />
            </div>

            {/* Row 3: Price + Category */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-foreground mb-1.5">
                  Price (₦) <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-bold text-muted-foreground pointer-events-none">₦</span>
                  <input
                    type="number"
                    min="1"
                    step="50"
                    placeholder="2500"
                    value={form.price}
                    onChange={(e) => setField("price", e.target.value)}
                    className={cn(
                      "w-full pl-7 pr-4 py-2.5 rounded-xl border text-sm outline-none transition-all",
                      errors.price
                        ? "border-red-400 bg-red-50 ring-2 ring-red-200"
                        : "border-gray-200 bg-gray-50 focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/20"
                    )}
                  />
                </div>
                {errors.price && (
                  <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                    <AlertTriangle size={11} /> {errors.price}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-foreground mb-1.5">Category</label>
                <select
                  value={form.category}
                  onChange={(e) => setField("category", e.target.value as AdminCategory)}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/20 text-sm outline-none transition-all"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Row 4: Image URL — type="text" not "url" so browser doesn't block submission */}
            <div>
              <label className="block text-sm font-semibold text-foreground mb-1.5">
                Image URL <span className="text-muted-foreground font-normal text-xs">(optional)</span>
              </label>
              <input
                type="text"
                placeholder="https://example.com/dish-photo.jpg"
                value={form.imageUrl}
                onChange={(e) => setField("imageUrl", e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/20 text-sm outline-none transition-all"
              />
              {form.imageUrl && (
                <div className="mt-2 flex items-center gap-3">
                  <img
                    src={form.imageUrl}
                    alt="Preview"
                    className="w-14 h-14 rounded-xl object-cover border border-gray-200"
                    onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                  />
                  <p className="text-xs text-muted-foreground">Image preview</p>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3 pt-1">
              <button
                type="submit"
                className="flex items-center gap-2 px-7 py-2.5 rounded-xl bg-primary text-white font-bold text-sm shadow-md shadow-primary/25 hover:bg-primary/90 active:scale-95 transition-all"
              >
                {editingId
                  ? <><Check size={16} /> Save Changes</>
                  : <><Plus  size={16} /> Add Dish</>}
              </button>
              {editingId && (
                <button
                  type="button"
                  onClick={cancelEdit}
                  className="px-5 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-muted-foreground hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              )}
            </div>

          </form>
        </div>

        {/* ── Dishes Table ────────────────────────────────────────── */}
        <div ref={tableRef} className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="font-bold text-foreground flex items-center gap-2">
              <UtensilsCrossed size={17} className="text-primary" />
              Current Menu
            </h2>
            <span className="bg-primary/10 text-primary text-xs font-bold px-2.5 py-1 rounded-full">
              {dishes.length} {dishes.length === 1 ? "dish" : "dishes"}
            </span>
          </div>

          {dishes.length === 0 ? (
            <div className="py-16 text-center text-muted-foreground">
              <p className="text-4xl mb-3">🍽</p>
              <p className="font-semibold">No dishes yet</p>
              <p className="text-sm mt-1">Use the form above to add your first dish.</p>
            </div>
          ) : (
            <>
              {/* Desktop table */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50 text-left border-b border-gray-100">
                      {["Dish", "Category", "Price", "Description", "Actions"].map((h) => (
                        <th key={h} className={cn(
                          "px-5 py-3 text-xs font-bold text-muted-foreground uppercase tracking-wider",
                          h === "Actions" && "text-right"
                        )}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {[...dishes].reverse().map((dish) => {
                      const isNew     = dish.id === newestId && newRowId !== null;
                      const isEditing = dish.id === editingId;
                      return (
                        <tr
                          key={dish.id}
                          className={cn(
                            "border-b border-gray-100 transition-colors",
                            isNew     && "bg-green-50",
                            isEditing && "bg-amber-50",
                            !isNew && !isEditing && "hover:bg-gray-50/70"
                          )}
                        >
                          {/* Dish name + image */}
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-11 h-11 rounded-xl border border-gray-100 bg-gray-50 flex items-center justify-center overflow-hidden shrink-0">
                                {dish.imageUrl ? (
                                  <img
                                    src={dish.imageUrl}
                                    alt={dish.name}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                      (e.target as HTMLImageElement).replaceWith(
                                        Object.assign(document.createElement("span"), {
                                          className: "text-gray-300",
                                          innerHTML: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>`,
                                        })
                                      );
                                    }}
                                  />
                                ) : (
                                  <ImageOff size={16} className="text-gray-300" />
                                )}
                              </div>
                              <span className="font-semibold text-foreground">{dish.name}</span>
                              {isNew && (
                                <span className="text-[10px] font-bold bg-green-200 text-green-800 px-2 py-0.5 rounded-full">New</span>
                              )}
                            </div>
                          </td>

                          {/* Category */}
                          <td className="px-5 py-4">
                            <span className={cn("px-2.5 py-1 rounded-full text-xs font-bold border", CAT_STYLE[dish.category])}>
                              {dish.category}
                            </span>
                          </td>

                          {/* Price */}
                          <td className="px-5 py-4 font-extrabold text-primary whitespace-nowrap">
                            ₦{dish.price.toLocaleString()}
                          </td>

                          {/* Description */}
                          <td className="px-5 py-4 text-muted-foreground max-w-xs">
                            <p className="text-xs leading-relaxed line-clamp-2">
                              {dish.description || <span className="italic opacity-50">No description</span>}
                            </p>
                          </td>

                          {/* Actions */}
                          <td className="px-5 py-4">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => handleEdit(dish)}
                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 text-xs font-semibold hover:bg-gray-50 hover:border-gray-300 transition-colors"
                              >
                                <Pencil size={12} /> Edit
                              </button>

                              {deletingId === dish.id ? (
                                <div className="flex items-center gap-1">
                                  <button
                                    onClick={() => handleDelete(dish.id)}
                                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-red-500 text-white text-xs font-bold hover:bg-red-600 transition-colors"
                                  >
                                    <Check size={12} /> Yes, delete
                                  </button>
                                  <button
                                    onClick={() => setDeletingId(null)}
                                    className="p-1.5 rounded-lg border border-gray-200 text-muted-foreground hover:bg-gray-50"
                                  >
                                    <X size={12} />
                                  </button>
                                </div>
                              ) : (
                                <button
                                  onClick={() => handleDelete(dish.id)}
                                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-red-200 text-xs font-semibold text-red-500 hover:bg-red-50 transition-colors"
                                >
                                  <Trash2 size={12} /> Delete
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Mobile cards */}
              <div className="md:hidden divide-y divide-gray-100">
                {[...dishes].reverse().map((dish) => {
                  const isNew = dish.id === newestId && newRowId !== null;
                  return (
                    <div key={dish.id} className={cn("p-4 flex gap-3", isNew && "bg-green-50")}>
                      <div className="w-16 h-16 rounded-xl border border-gray-100 bg-gray-50 flex items-center justify-center overflow-hidden shrink-0">
                        {dish.imageUrl
                          ? <img src={dish.imageUrl} alt={dish.name} className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
                          : <ImageOff size={18} className="text-gray-300" />
                        }
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <p className="font-bold text-sm text-foreground leading-snug">{dish.name}</p>
                          <span className={cn("shrink-0 px-2 py-0.5 rounded-full text-[10px] font-bold border", CAT_STYLE[dish.category])}>
                            {dish.category}
                          </span>
                        </div>
                        <p className="text-primary font-extrabold text-sm">₦{dish.price.toLocaleString()}</p>
                        {dish.description && (
                          <p className="text-muted-foreground text-xs mt-0.5 line-clamp-2">{dish.description}</p>
                        )}
                        <div className="flex gap-2 mt-3">
                          <button onClick={() => handleEdit(dish)} className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-gray-200 text-xs font-semibold hover:bg-gray-50">
                            <Pencil size={11} /> Edit
                          </button>
                          {deletingId === dish.id ? (
                            <>
                              <button onClick={() => handleDelete(dish.id)} className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-red-500 text-white text-xs font-bold">
                                <Check size={11} /> Confirm
                              </button>
                              <button onClick={() => setDeletingId(null)} className="p-1.5 rounded-lg border text-muted-foreground">
                                <X size={11} />
                              </button>
                            </>
                          ) : (
                            <button onClick={() => handleDelete(dish.id)} className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-red-200 text-xs font-semibold text-red-500 hover:bg-red-50">
                              <Trash2 size={11} /> Delete
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>

      </main>

      <footer className="py-5 text-center text-xs text-muted-foreground border-t border-gray-200 bg-white mt-8">
        Afro Foods Admin · Sir Kashim Ibrahim Rd, Minna · 0912 634 8476
      </footer>
    </div>
  );
}
