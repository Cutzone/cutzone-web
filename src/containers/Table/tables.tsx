import { TablePagination } from "@mui/base";
import { useState } from "react";
import { TableProps } from "./types";

export default function Table({ rows, headers }: TableProps) {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const handleChangePage = (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <div className="flex h-72 w-full justify-center overflow-y-auto">
      <table className="relative w-3/4">
        <thead>
          <tr className="sticky top-0 bg-gray-100">
            {headers.map((header) => (
              <th key={header} className="px-1 text-left">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {(rowsPerPage > 0
            ? rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            : rows
          ).map((row, i) => (
            <tr key={i}>
              {row.map((cell, idx) => (
                <td key={idx} className="px-1 text-left">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
        <tfoot className="w-full">
          <tr className="w-full">
            <TablePagination
              rowsPerPageOptions={[5, 10, 25, { label: "All", value: -1 }]}
              colSpan={3}
              count={rows.length}
              rowsPerPage={rowsPerPage}
              page={page}
              slotProps={{
                toolbar: {
                  className: "flex items-center gap-10 mt-5"
                },
                selectLabel: {
                  className: "m-0"
                },
                spacer: {
                  className: "hidden"
                },
                select: {
                  "aria-label": "rows per page"
                },
                actions: {
                  className: "flex gap-5 text-lg border px-2",
                  showFirstButton: true,
                  showLastButton: true
                }
              }}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </tr>
        </tfoot>
      </table>
    </div>
  );
}
