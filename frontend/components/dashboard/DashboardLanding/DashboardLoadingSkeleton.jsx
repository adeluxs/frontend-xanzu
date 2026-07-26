"use client";

const DashboardLoadingSkeleton = () => {
  const statCards = Array.from({ length: 4 });
  const tableRows = Array.from({ length: 5 });

  return (
    <div className="dashboard-top-gap animate-pulse">
      <div className="mb-7.5 flex flex-wrap items-center justify-between gap-3 border-b-2 border-dashed border-[rgba(7,33,38,0.16)] pb-7.5">
        <div className="space-y-3">
          <div className="h-4 w-24 rounded-full bg-grayish/10" />
          <div className="h-8 w-[220px] sm:w-[300px] rounded-full bg-grayish/12" />
        </div>
        <div className="h-10 w-full rounded-[10px] bg-primary/15 sm:w-[160px]" />
      </div>

      <div className="grid grid-cols-2 items-stretch gap-5 3xl:grid-cols-12">
        <div className="col-span-2 3xl:col-span-7">
          <div className="grid grid-cols-2 items-stretch gap-5 xl:grid-cols-12">
            <div className="col-span-2 xl:col-span-5">
              <div className="rounded-[12px] border-l border-r border-b border-t-5 border-[#88E788] bg-[#E7FAE7] p-5">
                <div className="h-10 w-10 rounded-[15px] bg-[#88E788]/70" />
                <div className="mt-5 space-y-3">
                  <div className="h-4 w-28 rounded-full bg-grayish/10" />
                  <div className="h-8 w-40 rounded-full bg-grayish/14" />
                  <div className="h-4 w-36 rounded-full bg-grayish/10" />
                </div>
                <div className="mt-7.5 flex flex-col gap-3 sm:flex-row">
                  <div className="h-10 flex-1 rounded-[10px] bg-white/70" />
                  <div className="h-10 flex-1 rounded-[10px] bg-primary/20" />
                </div>
              </div>
            </div>

            <div className="col-span-2 xl:col-span-7">
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                {statCards.map((_, index) => (
                  <div
                    key={index}
                    className="rounded-[12px] border border-[rgba(7,33,38,0.16)] p-4"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-[15px] bg-[#E6FAE6]" />
                      <div className="w-full space-y-2">
                        <div className="h-3.5 w-28 rounded-full bg-grayish/10" />
                        <div className="h-6 w-24 rounded-full bg-grayish/14" />
                      </div>
                    </div>
                    <div className="mt-3.5 flex items-center gap-2.5">
                      <div className="h-6 w-6 rounded-full bg-[#E6FAE6]" />
                      <div className="h-4 w-28 rounded-full bg-grayish/10" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="col-span-2 3xl:col-span-5">
          <div className="h-full rounded-[16px] border border-[rgba(7,33,38,0.16)] bg-white p-3 sm:p-5">
            <div className="flex items-center justify-between gap-3">
              <div className="h-5 w-28 rounded-full bg-grayish/12" />
              <div className="flex items-center gap-3">
                <div className="h-4 w-12 rounded-full bg-grayish/10" />
                <div className="h-4 w-14 rounded-full bg-grayish/12" />
              </div>
            </div>
            <div className="mt-6 h-[190px] rounded-[14px] bg-gradient-to-b from-[#E7FAE7] to-white">
              <div className="flex h-full items-end gap-2 px-4 pb-5">
                {Array.from({ length: 8 }).map((_, index) => (
                  <div
                    key={index}
                    className="flex-1 rounded-t-full bg-primary/20"
                    style={{ height: `${35 + ((index % 4) + 1) * 20}px` }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-1 gap-5 xl:grid-cols-2">
        {[0, 1].map((tableIndex) => (
          <div
            key={tableIndex}
            className="rounded-[12px] border border-[rgba(7,33,38,0.16)] p-3 sm:p-5"
          >
            <div className="mb-5 h-6 w-44 rounded-full bg-grayish/12" />
            <div className="w-full overflow-x-auto">
              <div className="min-w-[600px]">
                <div className="grid grid-cols-4 gap-3 rounded-[10px] bg-[#F3FDF3] px-4 py-3">
                  {Array.from({ length: 4 }).map((_, index) => (
                    <div
                      key={index}
                      className="h-4 rounded-full bg-[#CEF5CE]"
                    />
                  ))}
                </div>
                <div className="mt-3 space-y-3">
                  {tableRows.map((_, rowIndex) => (
                    <div
                      key={rowIndex}
                      className="grid grid-cols-4 gap-3 rounded-[10px] border border-[rgba(7,33,38,0.08)] px-4 py-3"
                    >
                      {Array.from({ length: 4 }).map((__, colIndex) => (
                        <div
                          key={colIndex}
                          className="h-4 rounded-full bg-grayish/10"
                        />
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DashboardLoadingSkeleton;
