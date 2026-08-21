import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api, API, formatApiErrorDetail } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Plus, Loader2, Sparkles, MessageSquarePlus } from "lucide-react";
import { toast } from "sonner";

function VideoPlayer({ path, testid }) {
  if (!path) return null;
  return (
    <video
      data-testid={testid}
      src={`${API}/files/${path}`}
      controls
      playsInline
      className="w-full rounded-xl border border-wwjd-line bg-black/5 max-h-[420px]"
    />
  );
}

export default function Stories() {
  const { user } = useAuth();
  const authed = user && typeof user === "object";
  const [testimonies, setTestimonies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [shareOpen, setShareOpen] = useState(false);
  const [updateFor, setUpdateFor] = useState(null);

  const load = async () => {
    try {
      const { data } = await api.get("/testimonies");
      setTestimonies(data);
    } catch (e) {
      /* ignore */
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const fmtDate = (iso) => {
    try {
      return new Date(iso).toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" });
    } catch {
      return "";
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-5 sm:px-8 py-10 animate-fade" data-testid="stories-page">
      <div className="text-center mb-10">
        <Sparkles className="mx-auto text-wwjd-gold mb-4" size={30} strokeWidth={1.4} />
        <h1 className="font-serif-display text-3xl sm:text-4xl text-wwjd-text">Stories of Freedom</h1>
        <p className="mt-4 text-wwjd-soft max-w-lg mx-auto leading-relaxed">
          Real people, set free from the grip of addiction — supported by the gifts of W.W.J.D.
          These stories continue over the years, as freedom takes root.
        </p>
        {authed && (
          <button
            onClick={() => setShareOpen(true)}
            data-testid="share-story-btn"
            className="mt-6 inline-flex items-center gap-1.5 px-6 py-3 rounded-full bg-wwjd-terracotta text-white text-sm hover:bg-[#a04e35] transition-colors"
          >
            <Plus size={16} /> Share your story
          </button>
        )}
      </div>

      {loading ? (
        <div className="flex justify-center py-16"><Loader2 className="animate-spin text-wwjd-gold" size={26} /></div>
      ) : testimonies.length === 0 ? (
        <div className="text-center py-16 text-wwjd-muted" data-testid="stories-empty">
          <p className="scripture-text text-lg text-wwjd-soft max-w-md mx-auto leading-relaxed">
            The first stories are still being written. As lives are set free, they will be shared
            here — honestly and hopefully.
          </p>
          {!authed && (
            <Link to="/gift" className="inline-block mt-6 text-wwjd-terracotta" data-testid="stories-gift-link">
              Give a gift that helps someone begin
            </Link>
          )}
        </div>
      ) : (
        <div className="space-y-10">
          {testimonies.map((t) => (
            <div key={t.id} data-testid={`testimony-${t.id}`} className="bg-white rounded-2xl border border-wwjd-line p-6 sm:p-8">
              <VideoPlayer path={t.video_path} testid={`testimony-video-${t.id}`} />
              <div className={t.video_path ? "mt-5" : ""}>
                <h3 className="font-serif-display text-xl text-wwjd-text">{t.name}</h3>
                <p className="text-xs text-wwjd-muted mt-0.5">{fmtDate(t.created_at)}</p>
                <p className="mt-3 text-wwjd-soft leading-relaxed whitespace-pre-wrap">{t.story}</p>
              </div>

              {t.updates && t.updates.length > 0 && (
                <div className="mt-6 border-l-2 border-wwjd-line pl-5 space-y-5">
                  {t.updates.map((u) => (
                    <div key={u.id} data-testid={`testimony-update-${u.id}`}>
                      <p className="text-xs text-wwjd-gold uppercase tracking-[0.15em]">An update · {fmtDate(u.created_at)}</p>
                      {u.video_path && <div className="mt-2"><VideoPlayer path={u.video_path} testid={`update-video-${u.id}`} /></div>}
                      <p className="mt-2 text-wwjd-soft leading-relaxed whitespace-pre-wrap">{u.text}</p>
                    </div>
                  ))}
                </div>
              )}

              {authed && (
                <button
                  onClick={() => setUpdateFor(t)}
                  data-testid={`add-update-btn-${t.id}`}
                  className="mt-6 inline-flex items-center gap-1.5 text-sm text-wwjd-terracotta border border-wwjd-line rounded-full px-4 py-2 hover:border-wwjd-terracotta transition-colors"
                >
                  <MessageSquarePlus size={15} /> Add an update to this story
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      <ShareDialog open={shareOpen} onClose={() => setShareOpen(false)} onDone={load} />
      <UpdateDialog testimony={updateFor} onClose={() => setUpdateFor(null)} onDone={load} />
    </div>
  );
}

function ShareDialog({ open, onClose, onDone }) {
  const [name, setName] = useState("");
  const [story, setStory] = useState("");
  const [file, setFile] = useState(null);
  const [saving, setSaving] = useState(false);

  const submit = async () => {
    if (!name.trim() || !story.trim()) {
      toast.error("Please share your name and a few words.");
      return;
    }
    setSaving(true);
    try {
      const fd = new FormData();
      fd.append("name", name);
      fd.append("story", story);
      if (file) fd.append("video", file);
      await api.post("/testimonies", fd, { headers: { "Content-Type": "multipart/form-data" } });
      toast.success("Thank you for sharing your story.");
      setName(""); setStory(""); setFile(null);
      onClose();
      onDone();
    } catch (err) {
      toast.error(formatApiErrorDetail(err.response?.data?.detail) || "Couldn't share your story.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="bg-wwjd-bg border-wwjd-line max-w-lg max-h-[90vh] overflow-y-auto" data-testid="share-story-dialog">
        <DialogHeader>
          <DialogTitle className="font-serif-display text-2xl text-wwjd-text">Share your story of freedom</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-wwjd-soft mb-1.5">Your name</label>
            <Input data-testid="share-name" value={name} onChange={(e) => setName(e.target.value)} className="bg-white border-wwjd-line focus-visible:ring-wwjd-gold" />
          </div>
          <div>
            <label className="block text-sm text-wwjd-soft mb-1.5">Your testimony</label>
            <Textarea data-testid="share-story" value={story} onChange={(e) => setStory(e.target.value)} rows={5} className="bg-white border-wwjd-line focus-visible:ring-wwjd-gold resize-none" placeholder="Where you were, and how freedom came…" />
          </div>
          <div>
            <label className="block text-sm text-wwjd-soft mb-1.5">A video (optional)</label>
            <input data-testid="share-video" type="file" accept="video/*" onChange={(e) => setFile(e.target.files?.[0] || null)} className="text-sm text-wwjd-soft file:mr-3 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-wwjd-beige file:text-wwjd-text" />
          </div>
          <button onClick={submit} disabled={saving} data-testid="share-submit" className="w-full py-3 rounded-full bg-wwjd-terracotta text-white font-medium hover:bg-[#a04e35] transition-colors flex items-center justify-center gap-2 disabled:opacity-60">
            {saving && <Loader2 className="animate-spin" size={16} />} Share my story
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function UpdateDialog({ testimony, onClose, onDone }) {
  const [text, setText] = useState("");
  const [file, setFile] = useState(null);
  const [saving, setSaving] = useState(false);

  const submit = async () => {
    if (!text.trim()) {
      toast.error("Please add a few words to your update.");
      return;
    }
    setSaving(true);
    try {
      const fd = new FormData();
      fd.append("text", text);
      if (file) fd.append("video", file);
      await api.post(`/testimonies/${testimony.id}/updates`, fd, { headers: { "Content-Type": "multipart/form-data" } });
      toast.success("Your update has been added.");
      setText(""); setFile(null);
      onClose();
      onDone();
    } catch (err) {
      toast.error(formatApiErrorDetail(err.response?.data?.detail) || "Couldn't add your update.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={!!testimony} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="bg-wwjd-bg border-wwjd-line max-w-lg max-h-[90vh] overflow-y-auto" data-testid="update-story-dialog">
        <DialogHeader>
          <DialogTitle className="font-serif-display text-2xl text-wwjd-text">
            Add an update {testimony ? `to ${testimony.name}'s story` : ""}
          </DialogTitle>
        </DialogHeader>
        <p className="text-sm text-wwjd-soft -mt-2 mb-2">Return any time — even years later — to show how freedom has continued.</p>
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-wwjd-soft mb-1.5">Your update</label>
            <Textarea data-testid="update-text" value={text} onChange={(e) => setText(e.target.value)} rows={5} className="bg-white border-wwjd-line focus-visible:ring-wwjd-gold resize-none" />
          </div>
          <div>
            <label className="block text-sm text-wwjd-soft mb-1.5">A new video (optional)</label>
            <input data-testid="update-video" type="file" accept="video/*" onChange={(e) => setFile(e.target.files?.[0] || null)} className="text-sm text-wwjd-soft file:mr-3 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-wwjd-beige file:text-wwjd-text" />
          </div>
          <button onClick={submit} disabled={saving} data-testid="update-submit" className="w-full py-3 rounded-full bg-wwjd-terracotta text-white font-medium hover:bg-[#a04e35] transition-colors flex items-center justify-center gap-2 disabled:opacity-60">
            {saving && <Loader2 className="animate-spin" size={16} />} Add update
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
