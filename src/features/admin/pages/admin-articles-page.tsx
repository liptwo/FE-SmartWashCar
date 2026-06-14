import { useState } from 'react'
import { Plus, Edit2, Trash2, Tag, BookOpen, User, Calendar, Check, X, Eye } from 'lucide-react'
import { motion, AnimatePresence } from 'motion/react'
import toast from 'react-hot-toast'
import { AdminSidebar } from '@/features/admin/components/admin-sidebar'
import { Button } from '@/shared/components/ui/button'
import { Card, CardContent } from '@/shared/components/ui/card'
import { Input } from '@/shared/components/ui/input'
import { mockArticles, type Article } from '@/features/articles/data/mock-articles'

export function AdminArticlesPage() {
  const [articles, setArticles] = useState<Article[]>(mockArticles)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingArticle, setEditingArticle] = useState<Article | null>(null)

  // Form states
  const [title, setTitle] = useState('')
  const [summary, setSummary] = useState('')
  const [content, setContent] = useState('')
  const [coverImage, setCoverImage] = useState('')
  const [category, setCategory] = useState<'VEHICLE' | 'SERVICE'>('VEHICLE')
  const [status, setStatus] = useState<'DRAFT' | 'PUBLISHED'>('PUBLISHED')
  const [author, setAuthor] = useState('')

  // Handle open modal for create
  const handleOpenCreate = () => {
    setEditingArticle(null)
    setTitle('')
    setSummary('')
    setContent('')
    setCoverImage('https://images.unsplash.com/photo-1607860108855-64acf2078ed9?auto=format&fit=crop&q=80&w=800')
    setCategory('VEHICLE')
    setStatus('PUBLISHED')
    setAuthor('Admin AutoWash')
    setIsModalOpen(true)
  }

  // Handle open modal for edit
  const handleOpenEdit = (article: Article) => {
    setEditingArticle(article)
    setTitle(article.title)
    setSummary(article.summary)
    setContent(article.content)
    setCoverImage(article.coverImage)
    setCategory(article.category)
    setStatus(article.status)
    setAuthor(article.author)
    setIsModalOpen(true)
  }

  // Handle save (Create or Update)
  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title || !summary || !content || !author || !coverImage) {
      toast.error('Vui lòng điền đầy đủ các thông tin cần thiết')
      return
    }

    if (editingArticle) {
      // Update
      const updatedArticles = articles.map((art) => {
        if (art.id === editingArticle.id) {
          return {
            ...art,
            title,
            slug: title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''),
            summary,
            content,
            coverImage,
            category,
            status,
            author,
            updatedAt: new Date().toISOString()
          }
        }
        return art
      })
      setArticles(updatedArticles)
      toast.success('Cập nhật bài viết thành công!')
    } else {
      // Create
      const newArticle: Article = {
        id: `art-${Date.now()}`,
        title,
        slug: title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''),
        summary,
        content,
        coverImage,
        category,
        status,
        author,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
      setArticles([newArticle, ...articles])
      toast.success('Tạo bài viết mới thành công!')
    }
    setIsModalOpen(false)
  }

  // Handle Delete
  const handleDelete = (id: string) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa bài viết này không?')) {
      const filtered = articles.filter((art) => art.id !== id)
      setArticles(filtered)
      toast.success('Đã xóa bài viết')
    }
  }

  // Toggle Publish Status
  const toggleStatus = (article: Article) => {
    const updated = articles.map((art) => {
      if (art.id === article.id) {
        const nextStatus = art.status === 'PUBLISHED' ? 'DRAFT' : 'PUBLISHED'
        toast.success(`Đã chuyển trạng thái sang ${nextStatus === 'PUBLISHED' ? 'Công khai' : 'Bản nháp'}`)
        return { ...art, status: nextStatus }
      }
      return art
    })
    setArticles(updated)
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  }

  return (
    <div className="min-h-screen bg-background text-on-surface">
      <AdminSidebar activeItem="articles" />

      {/* Main Content Area */}
      <main className="min-h-screen px-6 pb-8 pt-24 lg:pl-[calc(16rem+24px)]">
        <div className="mx-auto max-w-7xl space-y-6">
          {/* Header */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900">Quản lý bài viết</h1>
              <p className="text-sm text-slate-500">Tạo và chỉnh sửa cẩm nang chăm sóc xe hoặc thông tin gói dịch vụ</p>
            </div>
            <Button
              onClick={handleOpenCreate}
              className="flex items-center gap-2 bg-primary text-on-primary shadow-md hover:opacity-90 transition-opacity"
            >
              <Plus size={18} />
              Tạo bài viết mới
            </Button>
          </div>

          {/* List Table */}
          <Card className="overflow-hidden border border-slate-200/80 shadow-sm rounded-xl">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left text-sm text-slate-600">
                <thead className="bg-slate-50 text-xs font-semibold uppercase tracking-wider text-slate-500 border-b border-slate-100">
                  <tr>
                    <th className="px-6 py-4">Bài viết</th>
                    <th className="px-6 py-4">Chuyên mục</th>
                    <th className="px-6 py-4">Tác giả</th>
                    <th className="px-6 py-4">Ngày tạo</th>
                    <th className="px-6 py-4">Trạng thái</th>
                    <th className="px-6 py-4 text-right">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {articles.map((article) => (
                    <tr key={article.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4 max-w-sm">
                        <div className="flex items-center gap-3">
                          <img
                            src={article.coverImage}
                            alt=""
                            className="size-10 rounded-md object-cover bg-slate-100 border border-slate-100"
                          />
                          <div className="min-w-0">
                            <p className="font-semibold text-slate-900 truncate">{article.title}</p>
                            <p className="text-xs text-slate-450 truncate">{article.summary}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-semibold ${
                          article.category === 'VEHICLE'
                            ? 'bg-indigo-50 text-indigo-700'
                            : 'bg-emerald-50 text-emerald-700'
                        }`}>
                          <Tag size={12} />
                          {article.category === 'VEHICLE' ? 'Chăm sóc xe' : 'Dịch vụ'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap font-medium text-slate-700">
                        {article.author}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-slate-500">
                        {formatDate(article.createdAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => toggleStatus(article)}
                          className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold transition-colors cursor-pointer ${
                            article.status === 'PUBLISHED'
                              ? 'bg-green-100 text-green-700 hover:bg-green-200'
                              : 'bg-amber-100 text-amber-700 hover:bg-amber-200'
                          }`}
                        >
                          <span className={`size-1.5 rounded-full ${
                            article.status === 'PUBLISHED' ? 'bg-green-500' : 'bg-amber-500'
                          }`} />
                          {article.status === 'PUBLISHED' ? 'Công khai' : 'Nháp'}
                        </button>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-xs">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => handleOpenEdit(article)}
                            className="p-1.5 text-slate-550 hover:text-primary hover:bg-slate-100 rounded-md transition-colors"
                            title="Sửa bài"
                          >
                            <Edit2 size={16} />
                          </button>
                          <button
                            onClick={() => handleDelete(article.id)}
                            className="p-1.5 text-slate-550 hover:text-red-650 hover:bg-red-50 rounded-md transition-colors"
                            title="Xóa bài"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      </main>

      {/* Editor Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/20 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl max-w-2xl w-full p-6 border border-slate-200/80 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                <h3 className="text-sm font-bold uppercase tracking-tight text-slate-800">
                  {editingArticle ? 'Chỉnh sửa bài viết' : 'Tạo bài viết mới'}
                </h3>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-slate-450 hover:text-slate-650 text-xs font-bold cursor-pointer"
                >
                  Đóng
                </button>
              </div>

              <form onSubmit={handleSave} className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <label className="block text-[10px] font-bold text-slate-450 uppercase tracking-wider mb-1">
                      Tiêu đề bài viết *
                    </label>
                    <input
                      type="text"
                      required
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-200 bg-slate-50 rounded-lg text-xs font-medium focus:outline-none focus:border-indigo-500 focus:bg-white transition-colors"
                      placeholder="Nhập tiêu đề bài viết..."
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-450 uppercase tracking-wider mb-1">
                      Chuyên mục *
                    </label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value as any)}
                      className="w-full px-3 py-2 border border-slate-200 bg-slate-50 rounded-lg text-xs font-medium focus:outline-none focus:border-indigo-500 focus:bg-white transition-colors"
                    >
                      <option value="VEHICLE">Kinh nghiệm chăm sóc xe</option>
                      <option value="SERVICE">Thông tin dịch vụ xe</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-450 uppercase tracking-wider mb-1">
                      Trạng thái *
                    </label>
                    <select
                      value={status}
                      onChange={(e) => setStatus(e.target.value as any)}
                      className="w-full px-3 py-2 border border-slate-200 bg-slate-50 rounded-lg text-xs font-medium focus:outline-none focus:border-indigo-500 focus:bg-white transition-colors"
                    >
                      <option value="PUBLISHED">Công khai (Published)</option>
                      <option value="DRAFT">Bản nháp (Draft)</option>
                    </select>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-[10px] font-bold text-slate-450 uppercase tracking-wider mb-1">
                      Tác giả *
                    </label>
                    <input
                      type="text"
                      required
                      value={author}
                      onChange={(e) => setAuthor(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-200 bg-slate-50 rounded-lg text-xs font-medium focus:outline-none focus:border-indigo-500 focus:bg-white transition-colors"
                      placeholder="Tên tác giả..."
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-[10px] font-bold text-slate-450 uppercase tracking-wider mb-1">
                      Link ảnh bìa (Cover Image URL) *
                    </label>
                    <input
                      type="url"
                      required
                      value={coverImage}
                      onChange={(e) => setCoverImage(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-200 bg-slate-50 rounded-lg text-xs font-medium focus:outline-none focus:border-indigo-500 focus:bg-white transition-colors"
                      placeholder="Nhập đường dẫn ảnh bìa (Unsplash, imgur...)..."
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-[10px] font-bold text-slate-450 uppercase tracking-wider mb-1">
                      Tóm tắt ngắn *
                    </label>
                    <textarea
                      required
                      value={summary}
                      onChange={(e) => setSummary(e.target.value)}
                      className="w-full h-16 px-3 py-2 border border-slate-200 bg-slate-50 rounded-lg text-xs font-medium focus:outline-none focus:border-indigo-500 focus:bg-white transition-colors resize-none"
                      placeholder="Tóm tắt ngắn hiển thị trên thẻ bài viết..."
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-[10px] font-bold text-slate-450 uppercase tracking-wider mb-1">
                      Nội dung chi tiết (HTML được hỗ trợ) *
                    </label>
                    <textarea
                      required
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      className="w-full h-44 px-3 py-2 border border-slate-200 bg-slate-50 rounded-lg text-xs font-medium focus:outline-none focus:border-indigo-500 focus:bg-white transition-colors resize-y"
                      placeholder="Viết nội dung bài viết chi tiết tại đây (hỗ trợ các thẻ <p>, <h3>, <ul>, <li>...)..."
                    />
                  </div>
                </div>

                <div className="flex gap-3 pt-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 py-2.5 border border-slate-200 text-xs font-bold text-slate-650 rounded-xl hover:bg-slate-50 transition-colors"
                  >
                    Hủy bỏ
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 bg-primary text-on-primary text-xs font-bold rounded-xl hover:opacity-90 transition-opacity shadow-lg shadow-indigo-100 cursor-pointer"
                  >
                    {editingArticle ? 'Cập nhật bài viết' : 'Đăng bài viết'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
