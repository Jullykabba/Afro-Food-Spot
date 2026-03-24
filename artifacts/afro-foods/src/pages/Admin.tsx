import { useState } from "react";
import { Link } from "wouter";
import {
  UtensilsCrossed, Plus, Pencil, Trash2, X, Check,
  LayoutDashboard, ChevronRight, ImageOff, LogOut,
  AlertTriangle,
} from "lucide-react";
import { useAdminMenu, type AdminCategory, type AdminDish } from "@/store/use-admin-menu";
import { cn } from "@/lib/utils";

const CATEGORIES: AdminCategory[] = ["Appetizer", "Main Course", "Drink"];

const CATEGORY_COLORS: Record<AdminCategory, string> = {
  Appetizer:    "bg-amber-100 text-amber-700 border-amber-200",
  "Main Course": "bg-orange-100 text-orange-700 border-orange-200",
  Drink:        "bg-blue-100 text-blue-700 border-blue-200",
};

const EMPTY_FORM = {
  name: "",
  description: "",
  price: "",
  category: "Main Course" as AdminCategory,
  imageUrl: "",
};

export default function Admin() {
  const { dishes, addDish, updateDish, deleteDish } = useAdminMenu();

  const [form, setForm] = useState(EMPTY_FORM);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [errors, setErrors] = useState<Partial<typeof EMPTY_FORM>>({});
  const [successMsg, setSuccessMsg] = useState("");

  /* ── validation ─────────────────────────────────────── */
  const validate = () => {
    const e: Partial<typeof EMPTY_FORM> = {};
    if (!form.name.trim())        e.name        = "Dish name is required";
    if (!form.description.trim()) e.description = "Description is required";
    if (!form.price || isNaN(Number(form.price)) || Number(form.price) <= 0)
      e.price = "Enter a valid price";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const flash = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(""), 3000);
  };

  /* ── submit ──────────────────────────────────────────── */
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
      flash("Dish updated successfully!");
      setEditingId(null);
    } else {
      addDish(payload);
      flash("New dish added successfully!");
    }
    setForm(EMPTY_FORM);
    setErrors({});
  };

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
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setErrors({});
  };

  const handleDelete = (id: string) => {
    if (deleteConfirmId === id) {
      deleteDish(id);
      setDeleteConfirmId(null);
      flash("Dish deleted.");
    } else {
      setDeleteConfirmId(id);
    }
  };

  const field = (
    key: keyof typeof EMPTY_FORM,
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm((f) => ({ ...f, [key]: e.target.value }));
    if (errors[key]) setErrors((er) => ({ ...er, [key]: undefined }));
  };

  /* ── stats ───────────────────────────────────────────── */
  const stats = {
    total:     dishes.length,
    appetizer: dishes.filter((d) => d.category === "Appetizer").length,
    main:      dishes.filter((d) => d.category === "Main Course").length,
    drink:     dishes.filter((d) => d.category === "Drink").length,
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">

      {/* ── Top Bar ──────────────────────────────────────── */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center shadow-md shadow-primary/20">
              <UtensilsCrossed size={18} className="text-white" />
            </div>
            <div>
              <p className="font-extrabold text-foreground text-base leading-none">Afro Foods</p>
              <p className="text-[11px] text-muted-foreground font-medium">Admin Dashboard</p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <LayoutDashboard size={15} />
            <span className="hidden sm:inline">Manage Menu</span>
            <ChevronRight size={14} />
            <Link
              href="/"
              className="flex items-center gap-1.5 text-primary font-semibold hover:underline"
            >
              <LogOut size={14} /> Back to Site
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 space-y-8">

        {/* ── Stats Row ────────────────────────────────────── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: "Total Dishes",   value: stats.total,     color: "text-primary",   bg: "bg-orange-50 border-orange-100" },
            { label: "Appetizers",     value: stats.appetizer, color: "text-amber-600",  bg: "bg-amber-50 border-amber-100" },
            { label: "Main Courses",   value: stats.main,      color: "text-orange-600", bg: "bg-orange-50 border-orange-100" },
            { label: "Drinks",         value: stats.drink,     color: "text-blue-600",   bg: "bg-blue-50 border-blue-100" },
          ].map((s) => (
            <div key={s.label} className={cn("rounded-2xl border p-4 bg-white shadow-sm", s.bg)}>
              <p className={cn("text-3xl font-extrabold", s.color)}>{s.value}</p>
              <p className="text-sm text-muted-foreground font-medium mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>

        {/* ── Success flash ─────────────────────────────────── */}
        {successMsg && (
          <div className="flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 rounded-xl px-4 py-3 text-sm font-medium">
            <Check size={16} className="shrink-0" />
            {successMsg}
          </div>
        )}

        {/* ── Form Card ────────────────────────────────────── */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className={cn(
            "px-6 py-4 border-b border-gray-100 flex items-center justify-between",
            editingId ? "bg-amber-50" : "bg-orange-50"
          )}>
            <div className="flex items-center gap-2.5">
              {editingId
                ? <Pencil size={18} className="text-amber-600" />
                : <Plus   size={18} className="text-primary" />}
              <h2 className="font-bold text-foreground text-base">
                {editingId ? "Edit Dish" : "Add New Dish"}
              </h2>
            </div>
            {editingId && (
              <button
                onClick={handleCancelEdit}
                className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <X size={14} /> Cancel
              </button>
            )}
          </div>

          <form onSubmit={handleSubmit} className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

              {/* Dish Name */}
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-foreground mb-1.5">
                  Dish Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Peppered Chicken"
                  value={form.name}
                  onChange={(e) => field("name", e)}
                  className={cn(
                    "w-full px-4 py-2.5 rounded-xl border text-sm outline-none transition-all",
                    errors.name
                      ? "border-red-400 bg-red-50 focus:ring-2 focus:ring-red-200"
                      : "border-gray-200 bg-gray-50 focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/20"
                  )}
                />
                {errors.name && <p className="mt-1 text-xs text-red-500 flex items-center gap-1"><AlertTriangle size={11} />{errors.name}</p>}
              </div>

              {/* Description */}
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-foreground mb-1.5">
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={2}
                  placeholder="Brief description of the dish…"
                  value={form.description}
                  onChange={(e) => field("description", e)}
                  className={cn(
                    "w-full px-4 py-2.5 rounded-xl border text-sm outline-none transition-all resize-none",
                    errors.description
                      ? "border-red-400 bg-red-50 focus:ring-2 focus:ring-red-200"
                      : "border-gray-200 bg-gray-50 focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/20"
                  )}
                />
                {errors.description && <p className="mt-1 text-xs text-red-500 flex items-center gap-1"><AlertTriangle size={11} />{errors.description}</p>}
              </div>

              {/* Price */}
              <div>
                <label className="block text-sm font-semibold text-foreground mb-1.5">
                  Price (₦) <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-bold text-muted-foreground">₦</span>
                  <input
                    type="number"
                    min="0"
                    placeholder="2500"
                    value={form.price}
                    onChange={(e) => field("price", e)}
                    className={cn(
                      "w-full pl-8 pr-4 py-2.5 rounded-xl border text-sm outline-none transition-all",
                      errors.price
                        ? "border-red-400 bg-red-50 focus:ring-2 focus:ring-red-200"
                        : "border-gray-200 bg-gray-50 focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/20"
                    )}
                  />
                </div>
                {errors.price && <p className="mt-1 text-xs text-red-500 flex items-center gap-1"><AlertTriangle size={11} />{errors.price}</p>}
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-semibold text-foreground mb-1.5">Category</label>
                <select
                  value={form.category}
                  onChange={(e) => field("category", e)}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/20 text-sm outline-none transition-all appearance-none"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              {/* Image URL */}
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-foreground mb-1.5">
                  Image URL <span className="text-muted-foreground font-normal">(optional)</span>
                </label>
                <input
                  type="url"
                  placeholder="https://example.com/image.jpg"
                  value={form.imageUrl}
                  onChange={(e) => field("imageUrl", e)}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/20 text-sm outline-none transition-all"
                />
                {form.imageUrl && (
                  <div className="mt-2 flex items-center gap-3">
                    <img
                      src={form.imageUrl}
                      alt="Preview"
                      className="w-16 h-16 rounded-lg object-cover border border-gray-200"
                      onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                    />
                    <p className="text-xs text-muted-foreground">Image preview</p>
                  </div>
                )}
              </div>

            </div>

            {/* Submit */}
            <div className="mt-6 flex items-center gap-3">
              <button
                type="submit"
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-primary text-white font-bold text-sm shadow-md shadow-primary/25 hover:bg-primary/90 active:scale-95 transition-all"
              >
                {editingId ? <><Check size={16} /> Save Changes</> : <><Plus size={16} /> Add Dish</>}
              </button>
              {editingId && (
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="px-5 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-muted-foreground hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        {/* ── Dishes Table ─────────────────────────────────── */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-white">
            <h2 className="font-bold text-foreground text-base flex items-center gap-2">
              <UtensilsCrossed size={18} className="text-primary" />
              Current Menu
            </h2>
            <span className="bg-primary/10 text-primary text-xs font-bold px-2.5 py-1 rounded-full">
              {dishes.length} dishes
            </span>
          </div>

          {dishes.length === 0 ? (
            <div className="py-16 flex flex-col items-center text-center text-muted-foreground">
              <UtensilsCrossed size={36} className="mb-3 opacity-30" />
              <p className="font-semibold">No dishes yet</p>
              <p className="text-sm mt-1">Use the form above to add your first dish.</p>
            </div>
          ) : (
            <>
              {/* Desktop table */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50 text-left">
                      <th className="px-6 py-3 text-xs font-bold text-muted-foreground uppercase tracking-wider">Dish</th>
                      <th className="px-4 py-3 text-xs font-bold text-muted-foreground uppercase tracking-wider">Category</th>
                      <th className="px-4 py-3 text-xs font-bold text-muted-foreground uppercase tracking-wider">Price</th>
                      <th className="px-4 py-3 text-xs font-bold text-muted-foreground uppercase tracking-wider">Description</th>
                      <th className="px-4 py-3 text-xs font-bold text-muted-foreground uppercase tracking-wider text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {dishes.map((dish) => (
                      <tr
                        key={dish.id}
                        className={cn(
                          "hover:bg-gray-50/80 transition-colors",
                          editingId === dish.id && "bg-amber-50/60"
                        )}
                      >
                        {/* Name + image */}
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-xl border border-gray-100 overflow-hidden shrink-0 bg-gray-50 flex items-center justify-center">
                              {dish.imageUrl ? (
                                <img
                                  src={dish.imageUrl}
                                  alt={dish.name}
                                  className="w-full h-full object-cover"
                                  onError={(e) => {
                                    (e.target as HTMLImageElement).style.display = "none";
                                    (e.target as HTMLImageElement).nextElementSibling?.classList.remove("hidden");
                                  }}
                                />
                              ) : null}
                              <ImageOff size={18} className={cn("text-gray-300", dish.imageUrl ? "hidden" : "")} />
                            </div>
                            <span className="font-semibold text-foreground">{dish.name}</span>
                          </div>
                        </td>

                        {/* Category */}
                        <td className="px-4 py-4">
                          <span className={cn(
                            "inline-flex px-2.5 py-1 rounded-full text-xs font-bold border",
                            CATEGORY_COLORS[dish.category]
                          )}>
                            {dish.category}
                          </span>
                        </td>

                        {/* Price */}
                        <td className="px-4 py-4 font-bold text-primary">
                          ₦{dish.price.toLocaleString()}
                        </td>

                        {/* Description */}
                        <td className="px-4 py-4 text-muted-foreground max-w-xs">
                          <p className="line-clamp-2 text-xs leading-relaxed">{dish.description}</p>
                        </td>

                        {/* Actions */}
                        <td className="px-4 py-4">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleEdit(dish)}
                              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 text-xs font-semibold text-foreground hover:bg-gray-50 hover:border-gray-300 transition-colors"
                            >
                              <Pencil size={13} /> Edit
                            </button>

                            {deleteConfirmId === dish.id ? (
                              <div className="flex items-center gap-1">
                                <button
                                  onClick={() => handleDelete(dish.id)}
                                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-red-500 text-white text-xs font-bold hover:bg-red-600 transition-colors"
                                >
                                  <Check size={13} /> Confirm
                                </button>
                                <button
                                  onClick={() => setDeleteConfirmId(null)}
                                  className="p-1.5 rounded-lg border border-gray-200 text-muted-foreground hover:bg-gray-50 transition-colors"
                                >
                                  <X size={13} />
                                </button>
                              </div>
                            ) : (
                              <button
                                onClick={() => handleDelete(dish.id)}
                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-red-200 text-xs font-semibold text-red-500 hover:bg-red-50 transition-colors"
                              >
                                <Trash2 size={13} /> Delete
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile cards */}
              <div className="md:hidden divide-y divide-gray-100">
                {dishes.map((dish) => (
                  <div
                    key={dish.id}
                    className={cn(
                      "p-4 flex gap-3",
                      editingId === dish.id && "bg-amber-50/60"
                    )}
                  >
                    {/* Image */}
                    <div className="w-16 h-16 rounded-xl border border-gray-100 overflow-hidden shrink-0 bg-gray-50 flex items-center justify-center">
                      {dish.imageUrl ? (
                        <img
                          src={dish.imageUrl}
                          alt={dish.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = "none";
                          }}
                        />
                      ) : (
                        <ImageOff size={20} className="text-gray-300" />
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <p className="font-bold text-foreground text-sm leading-snug">{dish.name}</p>
                        <span className={cn(
                          "shrink-0 px-2 py-0.5 rounded-full text-[10px] font-bold border",
                          CATEGORY_COLORS[dish.category]
                        )}>
                          {dish.category}
                        </span>
                      </div>
                      <p className="text-primary font-extrabold text-sm mt-0.5">₦{dish.price.toLocaleString()}</p>
                      <p className="text-muted-foreground text-xs mt-1 line-clamp-1">{dish.description}</p>

                      <div className="flex items-center gap-2 mt-3">
                        <button
                          onClick={() => handleEdit(dish)}
                          className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-gray-200 text-xs font-semibold hover:bg-gray-50 transition-colors"
                        >
                          <Pencil size={12} /> Edit
                        </button>
                        {deleteConfirmId === dish.id ? (
                          <>
                            <button
                              onClick={() => handleDelete(dish.id)}
                              className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-red-500 text-white text-xs font-bold"
                            >
                              <Check size={12} /> Confirm
                            </button>
                            <button
                              onClick={() => setDeleteConfirmId(null)}
                              className="p-1.5 rounded-lg border text-muted-foreground"
                            >
                              <X size={12} />
                            </button>
                          </>
                        ) : (
                          <button
                            onClick={() => handleDelete(dish.id)}
                            className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-red-200 text-xs font-semibold text-red-500 hover:bg-red-50 transition-colors"
                          >
                            <Trash2 size={12} /> Delete
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

      </main>

      {/* ── Footer ───────────────────────────────────────── */}
      <footer className="border-t border-gray-200 bg-white py-4 text-center text-xs text-muted-foreground">
        Afro Foods Admin · Sir Kashim Ibrahim Rd, Minna · 0912 634 8476
      </footer>

    </div>
  );
}
