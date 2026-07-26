import { loadPageData } from "@/utils/serverUtils";
import { notFound } from "next/navigation";

async function fetchPageData(slug) {
  const response = await loadPageData(slug);

  if (!response?.status || !response?.data?.page) {
    return null;
  }

  return response;
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const pageData = await fetchPageData(slug);

  if (!pageData?.data?.page) {
    return {
      title: slug,
    };
  }

  const meta = pageData.data.page;
  const metaData = meta?.data || {};
  const siteMeta = pageData?.meta || {};

  const title = meta?.title;
  const description =
    (metaData?.meta_description && String(metaData.meta_description).trim()) ||
    "";

  const metadata = {
    title: title.includes(" | ") ? { absolute: title } : title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
    },
  };

  if (siteMeta?.favicon && typeof siteMeta.favicon === "string") {
    metadata.icons = {
      icon: {
        url: siteMeta.favicon,
        sizes: "32x32",
        type: "image/png",
      },
    };
  }

  return metadata;
}

export default async function Page({ params }) {
  const { slug } = await params;
  const pageData = await fetchPageData(slug);

  if (!pageData?.data?.page) {
    notFound();
  }

  const page = pageData.data.page;
  const pageDetails = page?.data || {};
  const pageTitle = pageDetails?.title || page?.title || slug;
  const pageContent = pageDetails?.content || "";

  return (
    <div className="py-[40px] sm:py-[50px] md:py-[60px]">
      <div className="custom-container mx-auto">
        <div className="mb-2 sm:mb-4">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-[40px] md:leading-[46px] lg:leading-[22px] font-bold text-grayish">
            {pageTitle}
          </h2>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-12 gap-7.5">
          <div className="col-span-2 lg:col-span-8">
            <div
              className="editor-content"
              dangerouslySetInnerHTML={{ __html: pageContent }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
