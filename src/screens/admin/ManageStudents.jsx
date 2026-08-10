import { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { FaMagnifyingGlass, FaFileExcel, FaXmark } from 'react-icons/fa6';
import { exportStudentsXlsxFile, fetchAllStudents } from '../../services/operations/AdminAPI';
import { fetchHostelBlockNames } from '../../services/operations/CommonAPI';

const BRANCH_OPTIONS = ['CSE', 'ECE', 'EEE', 'MECH', 'CIVIL', 'BIOTECH', 'CHEM', 'MME'];
const YEAR_OPTIONS = ['1', '2', '3', '4'];
const PAGE_SIZE_OPTIONS = [10, 25, 50, 100];

const EMPTY_FILTERS = {
  search: '',
  year: '',
  branch: '',
  hostelBlockId: '',
  floorNumber: '',
};

const selectClasses = 'w-full p-2 border border-gray-400 rounded-lg text-black bg-white';

const ManageStudents = () => {
  const [filters, setFilters] = useState(EMPTY_FILTERS);
  const [appliedFilters, setAppliedFilters] = useState(EMPTY_FILTERS);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(PAGE_SIZE_OPTIONS[1]);
  const [result, setResult] = useState({ students: [], total: 0, page: 1, limit: PAGE_SIZE_OPTIONS[1], totalPages: 1 });
  const [hostelBlocks, setHostelBlocks] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [exportMenuVisible, setExportMenuVisible] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { token } = useSelector((state) => state.Auth);

  const selectedHostelBlock = useMemo(
    () => hostelBlocks.find((block) => String(block.id) === String(filters.hostelBlockId)),
    [hostelBlocks, filters.hostelBlockId],
  );

  const floorOptions = useMemo(() => {
    const floorCount = parseInt(selectedHostelBlock?.floorCount);
    if (!floorCount || isNaN(floorCount)) return [];
    return Array.from({ length: floorCount }, (_, index) => index);
  }, [selectedHostelBlock]);

  const buildQuery = useCallback(
    (overrides = {}) => ({ ...appliedFilters, page, limit, ...overrides }),
    [appliedFilters, page, limit],
  );

  const loadStudents = useCallback(async () => {
    setIsLoading(true);
    const response = await dispatch(fetchAllStudents(buildQuery(), token, toast));
    if (response) {
      setResult(response);
      if (response.page !== page) setPage(response.page);
    }
    setIsLoading(false);
  }, [dispatch, buildQuery, token, page]);

  const loadHostelBlocks = useCallback(async () => {
    const response = await dispatch(fetchHostelBlockNames(toast));
    setHostelBlocks(response || []);
  }, [dispatch]);

  useEffect(() => {
    loadHostelBlocks();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    loadStudents();
    // eslint-disable-next-line
  }, [appliedFilters, page, limit, token]);

  const updateFilter = (key, value) => {
    // Floor numbers only mean something within a block, so switching blocks clears the floor.
    setFilters((current) => ({ ...current, [key]: value, ...(key === 'hostelBlockId' ? { floorNumber: '' } : {}) }));
  };

  const applyFilters = () => {
    setPage(1);
    setAppliedFilters(filters);
  };

  const clearFilters = () => {
    setPage(1);
    setFilters(EMPTY_FILTERS);
    setAppliedFilters(EMPTY_FILTERS);
  };

  const exportHandler = async (scope) => {
    setExportMenuVisible(false);
    setIsExporting(true);
    await dispatch(exportStudentsXlsxFile(buildQuery({ scope }), token, toast));
    setIsExporting(false);
  };

  const changePageSize = (nextLimit) => {
    setPage(1);
    setLimit(nextLimit);
  };

  const firstRowIndex = result.total === 0 ? 0 : (result.page - 1) * result.limit + 1;
  const lastRowIndex = Math.min(result.page * result.limit, result.total);

  return (
    <div className="w-full flex flex-col gap-4 px-4 pb-8">
      <h1 className="text-lg font-bold text-black text-center pt-5">Manage Students</h1>

      {/* Filters */}
      <div className="w-full border border-gray-300 rounded-lg bg-white p-4 flex flex-col gap-4">
        <div className="w-full flex flex-row flex-wrap gap-4">
          <div className="md:w-[32%] w-full flex flex-col gap-[0.25rem]">
            <label className="font-medium text-black">Search (Name / Roll No / Reg No)</label>
            <div className="w-full flex flex-row gap-2">
              <input
                className="w-full p-2 border border-gray-400 rounded-lg text-black"
                placeholder="Search students"
                value={filters.search}
                onChange={(e) => updateFilter('search', e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && applyFilters()}
              />
              <button
                className="px-3 bg-yellow-400 hover:bg-yellow-500 cursor-pointer transition-all duration-200 rounded-lg"
                onClick={applyFilters}
                aria-label="Search students"
              >
                <FaMagnifyingGlass className="text-black" />
              </button>
            </div>
          </div>

          <div className="md:w-[15%] w-full flex flex-col gap-[0.25rem]">
            <label className="font-medium text-black">Year</label>
            <select className={selectClasses} value={filters.year} onChange={(e) => updateFilter('year', e.target.value)}>
              <option value="">All Years</option>
              {YEAR_OPTIONS.map((year) => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>

          <div className="md:w-[15%] w-full flex flex-col gap-[0.25rem]">
            <label className="font-medium text-black">Branch</label>
            <select className={selectClasses} value={filters.branch} onChange={(e) => updateFilter('branch', e.target.value)}>
              <option value="">All Branches</option>
              {BRANCH_OPTIONS.map((branch) => (
                <option key={branch} value={branch}>{branch}</option>
              ))}
            </select>
          </div>

          <div className="md:w-[18%] w-full flex flex-col gap-[0.25rem]">
            <label className="font-medium text-black">Hostel Block</label>
            <select className={selectClasses} value={filters.hostelBlockId} onChange={(e) => updateFilter('hostelBlockId', e.target.value)}>
              <option value="">All Blocks</option>
              {hostelBlocks.map((block) => (
                <option key={block.id} value={block.id}>{block.name}</option>
              ))}
            </select>
          </div>

          <div className="md:w-[14%] w-full flex flex-col gap-[0.25rem]">
            <label className="font-medium text-black">Floor</label>
            <select
              className={`${selectClasses} disabled:opacity-60`}
              value={filters.floorNumber}
              onChange={(e) => updateFilter('floorNumber', e.target.value)}
              disabled={!filters.hostelBlockId}
            >
              <option value="">All Floors</option>
              {floorOptions.map((floor) => (
                <option key={floor} value={floor}>{floor}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="w-full flex flex-row flex-wrap justify-end items-center gap-3">
          <button
            className="cursor-pointer px-4 py-2 rounded font-bold bg-gray-200 hover:bg-gray-300 text-black transition-all duration-200"
            onClick={clearFilters}
          >
            Clear Filters
          </button>
          <button
            className="cursor-pointer px-4 py-2 rounded font-bold bg-yellow-400 hover:bg-yellow-500 text-black transition-all duration-200"
            onClick={applyFilters}
          >
            Apply Filters
          </button>

          {/* Export with a choice of scope */}
          <div className="relative">
            <button
              className="cursor-pointer px-4 py-2 rounded font-bold bg-green-600 hover:bg-green-700 text-white flex flex-row items-center gap-2 transition-all duration-200 disabled:opacity-60"
              onClick={() => setExportMenuVisible((visible) => !visible)}
              disabled={isExporting || result.total === 0}
            >
              <FaFileExcel /> Export
            </button>
            {exportMenuVisible && (
              <div className="absolute right-0 z-20 mt-2 w-64 bg-white border border-gray-300 rounded-lg shadow-lg overflow-hidden">
                <button
                  className="w-full text-left px-4 py-3 hover:bg-gray-100 cursor-pointer text-black"
                  onClick={() => exportHandler('all')}
                >
                  All filtered results ({result.total})
                </button>
                <button
                  className="w-full text-left px-4 py-3 hover:bg-gray-100 cursor-pointer text-black border-t border-gray-200"
                  onClick={() => exportHandler('page')}
                >
                  Current page only ({result.students.length})
                </button>
                <button
                  className="w-full flex flex-row items-center gap-2 px-4 py-2 hover:bg-gray-100 cursor-pointer text-gray-600 border-t border-gray-200 text-sm"
                  onClick={() => setExportMenuVisible(false)}
                >
                  <FaXmark /> Cancel
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Results */}
      {isLoading ? (
        <div className="flex justify-center items-center mt-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto mb-4"></div>
            <p className="text-black text-lg font-bold">Please Wait...</p>
          </div>
        </div>
      ) : result.students.length === 0 ? (
        <div className="text-gray-500 my-4 text-lg font-bold text-center">No students match the applied filters.</div>
      ) : (
        <div className="w-full overflow-x-auto border border-gray-300 rounded-lg bg-white">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-yellow-400 text-black">
                <th className="p-3 font-bold whitespace-nowrap">Name</th>
                <th className="p-3 font-bold whitespace-nowrap">Roll No</th>
                <th className="p-3 font-bold whitespace-nowrap">Reg No</th>
                <th className="p-3 font-bold whitespace-nowrap">Year</th>
                <th className="p-3 font-bold whitespace-nowrap">Branch</th>
                <th className="p-3 font-bold whitespace-nowrap">Gender</th>
                <th className="p-3 font-bold whitespace-nowrap">Block</th>
                <th className="p-3 font-bold whitespace-nowrap">Floor</th>
                <th className="p-3 font-bold whitespace-nowrap">Room</th>
                <th className="p-3 font-bold whitespace-nowrap">Cot</th>
                <th className="p-3 font-bold whitespace-nowrap">Status</th>
                <th className="p-3 font-bold whitespace-nowrap">Details</th>
              </tr>
            </thead>
            <tbody>
              {result.students.map((student) => (
                <tr key={student.id} className="border-t border-gray-200 hover:bg-[#caf0f8]">
                  <td className="p-3 whitespace-nowrap">{student.name}</td>
                  <td className="p-3 whitespace-nowrap">{student.rollNo ?? 'N/A'}</td>
                  <td className="p-3 whitespace-nowrap">{student.regNo}</td>
                  <td className="p-3 whitespace-nowrap">{student.year}</td>
                  <td className="p-3 whitespace-nowrap">{student.branch}</td>
                  <td className="p-3 whitespace-nowrap">{student.gender === 'M' ? 'Male' : 'Female'}</td>
                  <td className="p-3 whitespace-nowrap">{student.hostelBlock?.name ?? 'N/A'}</td>
                  <td className="p-3 whitespace-nowrap">{student.cot?.room?.floorNumber ?? 'N/A'}</td>
                  <td className="p-3 whitespace-nowrap">{student.cot?.room?.roomNumber ?? 'N/A'}</td>
                  <td className="p-3 whitespace-nowrap">{student.cot?.cotNo ?? 'N/A'}</td>
                  <td className="p-3 whitespace-nowrap font-semibold">{student.user?.status ?? 'N/A'}</td>
                  <td className="p-3 whitespace-nowrap">
                    <button
                      className="cursor-pointer text-blue-700 font-semibold hover:underline"
                      onClick={() => navigate(`/admin/search-student?id=${student.rollNo || student.regNo}`)}
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      <div className="w-full flex flex-row flex-wrap justify-between items-center gap-3">
        <span className="text-black font-semibold">
          Showing {firstRowIndex}-{lastRowIndex} of {result.total}
        </span>

        <div className="flex flex-row items-center gap-2">
          <label className="font-medium text-black">Rows per page:</label>
          <select
            className="p-2 border border-gray-400 rounded-lg text-black bg-white"
            value={limit}
            onChange={(e) => changePageSize(parseInt(e.target.value))}
          >
            {PAGE_SIZE_OPTIONS.map((size) => (
              <option key={size} value={size}>{size}</option>
            ))}
          </select>
        </div>

        <div className="flex flex-row items-center gap-2">
          <button
            className="px-3 py-2 rounded font-bold bg-gray-200 hover:bg-gray-300 text-black cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={() => setPage(1)}
            disabled={result.page <= 1 || isLoading}
          >
            First
          </button>
          <button
            className="px-3 py-2 rounded font-bold bg-gray-200 hover:bg-gray-300 text-black cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={() => setPage(result.page - 1)}
            disabled={result.page <= 1 || isLoading}
          >
            Prev
          </button>
          <span className="text-black font-semibold px-2">Page {result.page} of {result.totalPages}</span>
          <button
            className="px-3 py-2 rounded font-bold bg-gray-200 hover:bg-gray-300 text-black cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={() => setPage(result.page + 1)}
            disabled={result.page >= result.totalPages || isLoading}
          >
            Next
          </button>
          <button
            className="px-3 py-2 rounded font-bold bg-gray-200 hover:bg-gray-300 text-black cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={() => setPage(result.totalPages)}
            disabled={result.page >= result.totalPages || isLoading}
          >
            Last
          </button>
        </div>
      </div>
    </div>
  );
};

export default ManageStudents;
