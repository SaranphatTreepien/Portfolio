"use client";

import { memo } from "react";
import { createPortal } from "react-dom";

const PencilIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" /></svg>);

// ✅ Pre-mount และใช้ display: none แทนการ unmount
const ProjectFormModal = memo(({ 
  isOpen, onClose, editingProject, formData, setFormData, imagePreview,
  isSaving, isDragging, onSubmit, onDragOver, onDragLeave, onDrop, onFileSelect, onDateChange
}) => {
  if (typeof document === 'undefined') return null;

  return createPortal(
    <div 
      className="fixed inset-0 bg-black/70 z-[9999] flex items-center justify-center p-4 transition-opacity duration-150"
      style={{ 
        display: isOpen ? 'flex' : 'none',
        opacity: isOpen ? 1 : 0,
        contain: 'layout style paint'
      }}
    >
      <div 
        className="bg-white p-6 rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto relative"
        style={{ 
          contain: 'layout style paint',
          willChange: isOpen ? 'transform' : 'auto',
          transform: isOpen ? 'translateY(0) scale(1)' : 'translateY(10px) scale(0.98)',
          transition: 'transform 0.15s ease-out'
        }}
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            {editingProject ? <><PencilIcon /> แก้ไขโปรเจกต์</> : "+ เพิ่มโปรเจกต์ใหม่"}
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-red-500 transition-colors text-2xl leading-none">&times;</button>
        </div>

        <form onSubmit={onSubmit} className="flex flex-col gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">ชื่อโปรเจกต์ (Title)</label>
            <input required className="border p-3 rounded-xl w-full bg-gray-50 outline-none border-gray-200 text-black transition-all" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">ปี</label>
              <input required readOnly className="border p-2.5 rounded-lg w-full bg-gray-100 outline-none border-gray-200 text-black" value={formData.category} />
            </div>
            <div>
              <label className="flex justify-between items-end mb-1">
                <span className="text-sm font-medium text-gray-700">Slug</span>
                <span className="text-xs text-red-500">*ห้ามมีช่องว่าง</span>
              </label>
              <input required placeholder="eng-only" className="border p-2.5 rounded-lg w-full bg-gray-50 outline-none border-gray-200 text-black" value={formData.slug} onChange={e => setFormData({ ...formData, slug: e.target.value.replace(/\s+/g, '') })} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">วันที่</label>
              <input type="date" required className="border p-2.5 rounded-lg w-full bg-gray-50 outline-none border-gray-200 text-black" value={formData.createdAt} onChange={onDateChange} />
            </div>
            <div className="flex items-center gap-2 bg-gray-50 p-2.5 rounded-lg border border-gray-200 cursor-pointer" onClick={() => setFormData({ ...formData, isCertificate: !formData.isCertificate })}>
              <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${formData.isCertificate ? "bg-[#7edad2] border-[#7edad2]" : "border-gray-300 bg-white"}`}>
                {formData.isCertificate && <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-white" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>}
              </div>
              <span className="text-sm text-gray-700 select-none">Certificate🏆</span>
            </div>
            <div className={`flex items-center justify-center gap-1.5 p-2.5 rounded-lg border cursor-pointer select-none ${formData.isBest ? "bg-yellow-50 border-yellow-400 text-yellow-600" : "bg-gray-50 border-gray-200 text-gray-500"}`} onClick={() => setFormData({ ...formData, isBest: !formData.isBest })}>
              {formData.isBest ? <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-yellow-500"><path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" /></svg> : <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.563.045.797.777.385 1.178l-4.154 4.045a.563.563 0 00-.153.518l1.268 5.443c.129.554-.474.975-.92.68l-4.665-2.923a.563.563 0 00-.606 0L6.92 21.24c-.445.295-1.05-.126-.92-.68l1.268-5.443a.563.563 0 00-.153-.518L2.96 10.575c-.412-.401-.178-1.133.386-1.178l5.518-.442a.563.563 0 00.474-.345L11.48 3.5z" /></svg>}
              <span className="text-xs font-medium">Best</span>
            </div>
            <div className={`flex items-center gap-2 p-2.5 rounded-lg border cursor-pointer select-none ${formData.isCloud ? "bg-sky-50 border-sky-400 text-sky-600" : "bg-gray-50 border-gray-200 text-gray-500"}`} onClick={() => setFormData({ ...formData, isCloud: !formData.isCloud })}>
              <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${formData.isCloud ? "bg-sky-400 border-sky-400" : "border-gray-300 bg-white"}`}>
                {formData.isCloud && <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-white" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>}
              </div>
              <span className="text-xs select-none">☁️ Cloud</span>
            </div>
            <div className={`flex items-center gap-2 p-2.5 rounded-lg border cursor-pointer select-none ${formData.isNetwork ? "bg-emerald-50 border-emerald-400 text-emerald-600" : "bg-gray-50 border-gray-200 text-gray-500"}`} onClick={() => setFormData({ ...formData, isNetwork: !formData.isNetwork })}>
              <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${formData.isNetwork ? "bg-emerald-400 border-emerald-400" : "border-gray-300 bg-white"}`}>
                {formData.isNetwork && <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-white" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>}
              </div>
              <span className="text-xs select-none">🌐 Network</span>
            </div>
            <div className={`flex items-center gap-2 p-2.5 rounded-lg border cursor-pointer select-none ${formData.isCommunity ? "bg-purple-50 border-purple-400 text-purple-600" : "bg-gray-50 border-gray-200 text-gray-500"}`} onClick={() => setFormData({ ...formData, isCommunity: !formData.isCommunity })}>
              <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${formData.isCommunity ? "bg-purple-400 border-purple-400" : "border-gray-300 bg-white"}`}>
                {formData.isCommunity && <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-white" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>}
              </div>
              <span className="text-xs select-none">🤝 Community</span>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">รูปปก</label>
            <div onDragOver={onDragOver} onDragLeave={onDragLeave} onDrop={onDrop} className={`border-2 border-dashed rounded-lg p-3 text-center cursor-pointer relative group ${isDragging ? "border-[#7edad2] bg-[#7edad2]/10" : "border-gray-300"}`}>
              <input type="file" accept="image/*" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20" onChange={(e) => onFileSelect(e.target.files[0])} />
              {imagePreview ? (
                <div className="relative">
                  <img src={imagePreview} alt="preview" className="h-32 mx-auto rounded-lg object-contain" />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg text-white text-xs font-bold pointer-events-none">เปลี่ยนรูป</div>
                </div>
              ) : (
                <div className="text-gray-400 text-xs py-6 pointer-events-none">
                  <div><span className="text-[#7edad2] font-bold">คลิก</span> หรือลากรูป</div>
                </div>
              )}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Link <span className="text-xs text-gray-400">(ไม่บังคับ)</span></label>
            <input type="url" placeholder="https://..." className="border p-2.5 rounded-lg w-full bg-gray-50 outline-none border-gray-200 text-black" value={formData.link} onChange={e => setFormData({ ...formData, link: e.target.value })} />
          </div>
          <div className="flex justify-end gap-2 mt-3 border-t pt-3">
            <button type="button" onClick={onClose} className="px-4 py-2 text-gray-500 hover:bg-gray-100 rounded-lg text-sm">ยกเลิก</button>
            <button type="submit" disabled={isSaving} className={`px-6 py-2 rounded-lg font-bold text-sm flex items-center gap-2 ${isSaving ? "bg-gray-300 text-gray-500" : "bg-[#7edad2] text-black hover:bg-[#6bcbc0]"}`}>
              {isSaving ? (<><span className="animate-spin h-4 w-4 border-2 border-gray-600 border-t-transparent rounded-full"></span><span>บันทึก...</span></>) : (editingProject ? "บันทึก" : "เพิ่ม")}
            </button>
          </div>
        </form>
      </div>

      {/* ✅ ลบ style tags - ไม่ต้องใช้ keyframes แล้ว */}
    </div>,
    document.body
  );
});

ProjectFormModal.displayName = 'ProjectFormModal';
export default ProjectFormModal;
