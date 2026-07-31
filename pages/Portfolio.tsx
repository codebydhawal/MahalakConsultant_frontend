import React, { useEffect, useState } from "react";
import ProjectService from "../services/ProjectService";
import {
  ProjectResponse,
  PROJECT_CATEGORIES,
} from "../services/project";

export const Portfolio: React.FC = () => {
  const [projects, setProjects] = useState<ProjectResponse[]>([]);
  const [filter, setFilter] = useState("All");
  const [selectedProject, setSelectedProject] =
    useState<ProjectResponse | null>(null);

  const [projectHtml, setProjectHtml] = useState("");
  const [searchKeyword, setSearchKeyword] = useState("");

  const filteredProjects =
    filter === "All"
      ? projects
      : projects.filter(
        (p) =>
          p.category
            .replaceAll("_", " ")
            .toLowerCase()
            .replace(/\b\w/g, (c) => c.toUpperCase()) === filter
      );

  const formatCategory = (category: string) =>
    category
      .replaceAll("_", " ")
      .toLowerCase()
      .replace(/\b\w/g, (c) => c.toUpperCase());

  const categories = [
    "All",
    ...PROJECT_CATEGORIES.map(formatCategory),
  ];

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      const response = await ProjectService.getAllProjects();
      setProjects(response.data.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      searchProjects(searchKeyword);
    }, 400);

    return () => clearTimeout(timer);
  }, [searchKeyword, filter]);

  const searchProjects = async (keyword: string) => {
    try {
      if (keyword.trim() === "") {
        loadProjects();
        return;
      }

      const response = await ProjectService.searchProjects(keyword);
      setProjects(response.data.data);
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <div className="min-h-screen overflow-x-hidden">
      <div className="max-w-7xl mx-auto px-6 pt-10 pb-24">
        <div className="flex flex-col md:flex-row justify-between items-end mb-10 border-b border-stone-100 pb-12 gap-8">
          <div>
            <h1 className="text-7xl font-bold text-stone-900 mb-6 tracking-tighter">Archive</h1>
            <p className="text-stone-400 text-xs font-bold uppercase tracking-[0.4em] letter-spacing-wide">Portfolio / Selected Works</p>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row lg:items-center gap-8 mb-12">
          {/* Search Box */}
          <div className="relative w-full max-w-md shrink-0">
            <i className="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-stone-400"></i>

            <input
              type="text"
              placeholder="Search projects..."
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              className="w-full border border-stone-200 py-3 pl-12 pr-4 text-sm outline-none focus:border-stone-900 transition-all"
            />
          </div>

          {/* Categories */}
          <div className="flex flex-wrap gap-8 overflow-x-auto no-scrollbar">
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setFilter(c)}
                className={`text-[10px] font-bold uppercase tracking-widest transition-all pb-2 border-b-2 shrink-0 ${filter === c
                  ? "border-stone-900 text-stone-900"
                  : "border-transparent text-stone-400 hover:text-stone-900"
                  }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        {/* Mobile Slider Grid */}
        <div className="flex md:grid md:grid-cols-2 lg:grid-cols-3 gap-1 overflow-x-auto md:overflow-visible no-scrollbar -mx-6 px-6 pb-10 snap-x snap-mandatory">
          {filteredProjects.map(project => (
            <div
              key={project.projectId}
              onClick={async () => {
                setSelectedProject(project);

                try {
                  const response = await ProjectService.getProjectDocumentContent(
                    project.projectId
                  );

                  setProjectHtml(response.data.html);
                } catch (e) {
                  setProjectHtml(project.shortDescription);
                }
              }}
              className="group relative overflow-hidden aspect-[16/10] bg-stone-50 cursor-pointer shrink-0 w-[300px] sm:w-[450px] md:w-auto snap-center"
            >
              <img
                src={project.thumbnailUrl}
                alt={project.title}
                className="w-full h-full object-cover grayscale-[0.3] group-hover:grayscale-0 transition-all duration-1000 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-stone-900/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-12">
                <span className="text-[9px] font-bold text-white uppercase tracking-[0.4em] mb-4 opacity-70">{project.category
                  .replaceAll("_", " ")
                  .toLowerCase()
                  .replace(/\b\w/g, (c) => c.toUpperCase())}</span>
                <h3 className="text-white text-3xl font-bold">{project.title}</h3>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Project Expansion Modal */}
      {selectedProject && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-white/95 backdrop-blur-sm animate-in fade-in duration-500">
          <div className="max-w-7xl w-full max-h-[90vh] overflow-y-auto bg-white flex flex-col md:flex-row relative">
            <button
              onClick={() => setSelectedProject(null)}
              className="absolute top-8 right-8 w-12 h-12 bg-white rounded-full flex items-center justify-center z-50 hover:bg-stone-100 transition-all"
            >
              <i className="fa-solid fa-xmark text-stone-900"></i>
            </button>

            <div className="md:w-3/5">
              <img src={selectedProject.thumbnailUrl} className="w-full h-full object-cover" />
            </div>

            <div className="md:w-2/5 p-12 md:p-24 flex flex-col justify-center">
              <span className="text-amber-700 text-[10px] font-bold uppercase tracking-[0.4em] block mb-8">{formatCategory(selectedProject.category)}</span>
              <h2 className="text-5xl font-bold text-stone-900 mb-12 tracking-tighter">{selectedProject.title}</h2>
              <div
                className="rich-text-content text-stone-500 leading-relaxed text-lg font-light"
                dangerouslySetInnerHTML={{ __html: projectHtml, }}
              ></div>
              <div className="mt-20 pt-12 border-t border-stone-100">
                <button onClick={() => setSelectedProject(null)} className="text-[10px] font-bold uppercase tracking-widest border-b border-stone-900 pb-1">Close Details</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
