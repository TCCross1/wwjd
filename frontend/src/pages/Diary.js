import React, { useEffect, useState } from "react";
import { api, formatApiErrorDetail } from "@/lib/api";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Plus, BookOpen, Trash2, Loader2 } from "lucide-react";
import { toast } from "sonner";

const empty = { title: "", brought: "", counsel: "", response: "", walked_out: "" };

export default function Diary() {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(empty);
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    try {
      const { data } = await api.get("/diary");
      setEntries(data);
    } catch (e) {
      /* ignore */
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const openNew = () => {
    setForm(empty);
    setEditingId(null);
    setOpen(true);
  };

  const openEdit = (entry) => {
    setForm({
      title: entry.title || "",
      brought: entry.brought || "",
      counsel: entry.counsel || "",
      response: entry.response || "",
      walked_out: entry.walked_out || "",
    });
    setEditingId(entry.id);
    setOpen(true);
  };

  const save = async () => {
    setSaving(true);
    try {
      if (editingId) {
        await api.put(`/diary/${editingId}`, form);
      } else {
        await api.post("/diary", form);
      }
      setOpen(false);
      await load();
      toast.success("Saved to your diary.");
    } catch (err) {
      toast.error(formatApiErrorDetail(err.response?.data?.detail) || "Couldn't save.");
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id) => {
    try {
      await api.delete(`/diary/${id}`);
      setEntries((e) => e.filter((x) => x.id !== id));
    } catch (err) {
      toast.error("Couldn't delete that entry.");
    }
  };

  const fmtDate = (iso) => {
    try {
      return new Date(iso).toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" });
    } catch {
      return "";
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-5 sm:px-8 py-10 animate-fade" data-testid="diary-page">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-serif-display text-3xl text-wwjd-text">Spiritual diary</h1>
          <p className="text-wwjd-soft mt-1 text-sm">A private record of what you brought and how you walked it out.</p>
        </div>
        <button
          onClick={openNew}
          data-testid="diary-new-btn"
          className="shrink-0 inline-flex items-center gap-1.5 px-5 py-3 rounded-full bg-wwjd-terracotta text-white text-sm hover:bg-[#a04e35] transition-colors"
        >
          <Plus size={16} /> New entry
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-16"><Loader2 className="animate-spin text-wwjd-gold" size={26} /></div>
      ) : entries.length === 0 ? (
        <div className="text-center py-16 text-wwjd-muted" data-testid="diary-empty">
          <BookOpen className="mx-auto mb-4 text-wwjd-gold/50" size={40} strokeWidth={1.3} />
          <p>Your diary is quiet for now. Begin whenever you're ready.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {entries.map((entry) => (
            <div
              key={entry.id}
              data-testid={`diary-entry-${entry.id}`}
              className="bg-white rounded-2xl border border-wwjd-line p-6 group"
            >
              <div className="flex items-start justify-between gap-3">
                <button onClick={() => openEdit(entry)} className="text-left flex-1">
                  <p className="text-xs text-wwjd-muted">{fmtDate(entry.created_at)}</p>
                  <h3 className="font-serif-display text-lg text-wwjd-text mt-1">
                    {entry.title || "Untitled entry"}
                  </h3>
                  {entry.brought && <p className="text-sm text-wwjd-soft mt-2 line-clamp-2 whitespace-pre-wrap">{entry.brought}</p>}
                </button>
                <button
                  onClick={() => remove(entry.id)}
                  data-testid={`diary-delete-${entry.id}`}
                  className="opacity-0 group-hover:opacity-100 text-wwjd-muted hover:text-wwjd-terracotta transition-all"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="bg-wwjd-bg border-wwjd-line max-w-lg max-h-[90vh] overflow-y-auto" data-testid="diary-dialog">
          <DialogHeader>
            <DialogTitle className="font-serif-display text-2xl text-wwjd-text">
              {editingId ? "Edit entry" : "New entry"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-wwjd-soft mb-1.5">Title</label>
              <Input
                data-testid="diary-title"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="bg-white border-wwjd-line focus-visible:ring-wwjd-gold"
                placeholder="A few words…"
              />
            </div>
            {[
              { key: "brought", label: "What I brought" },
              { key: "counsel", label: "The counsel I received" },
              { key: "response", label: "My own response or prayer" },
              { key: "walked_out", label: "How I tried to walk it out" },
            ].map((f) => (
              <div key={f.key}>
                <label className="block text-sm text-wwjd-soft mb-1.5">{f.label}</label>
                <Textarea
                  data-testid={`diary-${f.key}`}
                  value={form[f.key]}
                  onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
                  rows={3}
                  className="bg-white border-wwjd-line focus-visible:ring-wwjd-gold resize-none"
                />
              </div>
            ))}
            <button
              onClick={save}
              disabled={saving}
              data-testid="diary-save-btn"
              className="w-full py-3 rounded-full bg-wwjd-terracotta text-white font-medium hover:bg-[#a04e35] transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {saving && <Loader2 className="animate-spin" size={16} />} Save entry
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
