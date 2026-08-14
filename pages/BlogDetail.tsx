import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import BlogService from "../services/BlogService";
import { BlogResponse } from "../services/BlogResponse";
import { getDashboardBasePath } from "../services/RouteUtils";
import { API_ENDPOINTS } from "../config/api";
// TypeScript may not have type declarations for these CSS side-effect imports.
// @ts-ignore: allow importing CSS for react-pdf
import "react-pdf/dist/Page/TextLayer.css";
// @ts-ignore: allow importing CSS for react-pdf
import "react-pdf/dist/Page/AnnotationLayer.css";
import { Document, Page } from "react-pdf";
import { pdfjs } from "react-pdf";
// @ts-ignore: allow importing PDF worker for react-pdf
import pdfWorker from "pdfjs-dist/build/pdf.worker.min.mjs?url";

pdfjs.GlobalWorkerOptions.workerSrc = pdfWorker;

export const BlogDetail: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const basePath = getDashboardBasePath();

  const [blog, setBlog] = useState<BlogResponse>();
  const [loading, setLoading] = useState(true);
  const [numPages, setNumPages] = useState(0);

  useEffect(() => {

    if (id) {
      loadBlog();
    }

  }, [id]);
  const loadBlog = async () => {

    try {

      const response = await BlogService.getBlogById(id as string);

      setBlog(response.data.data);

    } catch (error) {

      console.log(error);

    } finally {

      setLoading(false);

    }

  }

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {

    setNumPages(numPages);

  }

  if (loading) {

    return <div>Loading...</div>;

  }

  if (!blog) {

    return <div>Blog not found</div>;

  }

  return (
    <div className="bg-white min-h-screen pb-24 animate-in fade-in duration-700">
      {/* Hero Section */}
      <div className="relative h-[65vh] bg-stone-900 overflow-hidden">
        <img
          src={blog.featuredImageUrl}
          className="w-full h-full object-cover opacity-60 scale-105"
          alt={blog.title}
        />

        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-stone-950/90"></div>

        <div className="absolute inset-0 flex items-end justify-center pb-20 px-4">
          <div className="max-w-4xl text-center">
            <div className="flex justify-center gap-3 mb-8">
              <span className="px-5 py-1.5 bg-amber-600 text-white text-[10px] font-bold uppercase tracking-widest rounded-full">
                {blog.category}
              </span>
            </div>

            <h1 className="text-4xl md:text-7xl font-bold text-white leading-[1.1] mb-8 tracking-tighter">
              {blog.title}
            </h1>

            <div className="flex justify-center items-center gap-8 text-stone-400 text-[11px] font-bold uppercase tracking-[0.3em]">
              <span>{blog.publishDate}</span>

              <span className="w-1.5 h-1.5 bg-amber-600 rounded-full"></span>

              <span>By {blog.authorName}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 mt-20">

        <div className="mb-16">
          <button
            onClick={() => navigate("/blog")}
            className="text-[10px] font-bold uppercase text-stone-400 hover:text-amber-700 flex items-center gap-3 transition-colors"
          >
            <i className="fa-solid fa-arrow-left-long"></i>
            Return to journals
          </button>
        </div>

        <div className="prose-container">

          {/* Short Description */}

          <div className="text-2xl text-stone-600 leading-relaxed font-light mb-16 italic border-l-[6px] border-amber-600 pl-10 py-4 bg-stone-50 rounded-r-3xl">
            {blog.shortDescription}
          </div>

          {/* PDF */}

          <div className="rich-text-content flex flex-col items-center">

            <Document
              file={`${API_ENDPOINTS.BLOG}/pdf/${blog.contentFileId}`}
              onLoadSuccess={onDocumentLoadSuccess}
              loading={<div className="text-center py-10">Loading PDF...</div>}
            >
              {Array.from(new Array(numPages), (_, index) => (
                <div
                  key={index}
                >
                  <Page
                    pageNumber={index + 1}
                    width={900}
                    renderTextLayer={false}
                    renderAnnotationLayer={false}
                  />
                </div>
              ))}
            </Document>

          </div>

        </div>

        {/* Author */}

        <div className="mt-24 pt-16 border-t border-stone-100 flex flex-col md:flex-row items-center justify-between gap-10 bg-stone-50 p-10 rounded-[3rem]">

          <div className="flex items-center gap-8">

            <div className="w-24 h-24 rounded-full bg-stone-200 flex items-center justify-center text-4xl text-stone-400 overflow-hidden shadow-lg border-4 border-white">

              {blog.authorImageUrl ? (

                <img
                  src={blog.authorImageUrl}
                  alt={blog.authorName}
                  className="w-full h-full object-cover"
                />

              ) : (

                <i className="fa-solid fa-user-tie"></i>

              )}

            </div>

            <div>

              <p className="text-amber-700 text-[10px] uppercase font-bold tracking-[0.3em] mb-2">
                Author
              </p>

              <p className="font-bold text-2xl text-stone-900">
                {blog.authorName}
              </p>

              <p className="text-stone-400 text-xs font-medium">
                {blog.category}
              </p>

            </div>

          </div>

          <div className="flex gap-4">

            <button className="w-12 h-12 rounded-full bg-white border border-stone-200 flex items-center justify-center hover:bg-amber-600 hover:text-white transition-all shadow-sm">
              <i className="fa-brands fa-facebook-f"></i>
            </button>

            <button className="w-12 h-12 rounded-full bg-white border border-stone-200 flex items-center justify-center hover:bg-amber-600 hover:text-white transition-all shadow-sm">
              <i className="fa-brands fa-twitter"></i>
            </button>

            <button className="w-12 h-12 rounded-full bg-white border border-stone-200 flex items-center justify-center hover:bg-amber-600 hover:text-white transition-all shadow-sm">
              <i className="fa-solid fa-share-nodes"></i>
            </button>

          </div>

        </div>

      </div>

      <style>{`
      .react-pdf__Page {
        margin-bottom: 40px;
      }

      .react-pdf__Page canvas {
        border-radius: 24px;
        box-shadow: 0 25px 50px -12px rgba(0,0,0,0.15);
        max-width: 100%;
        height: auto !important;
      }
    `}</style>
    </div>
  );
}