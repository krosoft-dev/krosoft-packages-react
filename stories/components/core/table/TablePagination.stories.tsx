import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { TablePagination } from "@/components/core/table/TablePagination";

const DEFAULT_PAGE_SIZE_OPTIONS = [10, 25, 50, 100];

const meta: Meta<typeof TablePagination> = {
  title: "Core/Table/TablePagination",
  component: TablePagination,
  decorators: [
    Story => {
      return (
        <div className="w-full border rounded-md overflow-hidden">
          <Story />
        </div>
      );
    },
  ],
};

export default meta;
type Story = StoryObj<typeof TablePagination>;

export const FirstPage: Story = {
  render: () => {
    const [pageSize, setPageSize] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    return (
      <TablePagination
        totalItems={87}
        startIndex={0}
        endIndex={10}
        pageSize={pageSize}
        setPageSize={setPageSize}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        pageSizeOptions={DEFAULT_PAGE_SIZE_OPTIONS}
        totalPages={9}
      />
    );
  },
};

export const MiddlePage: Story = {
  render: () => {
    const [pageSize, setPageSize] = useState(10);
    const [currentPage, setCurrentPage] = useState(4);
    return (
      <TablePagination
        totalItems={87}
        startIndex={30}
        endIndex={40}
        pageSize={pageSize}
        setPageSize={setPageSize}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        pageSizeOptions={DEFAULT_PAGE_SIZE_OPTIONS}
        totalPages={9}
      />
    );
  },
};

export const LastPage: Story = {
  render: () => {
    const [pageSize, setPageSize] = useState(10);
    const [currentPage, setCurrentPage] = useState(9);
    return (
      <TablePagination
        totalItems={87}
        startIndex={80}
        endIndex={87}
        pageSize={pageSize}
        setPageSize={setPageSize}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        pageSizeOptions={DEFAULT_PAGE_SIZE_OPTIONS}
        totalPages={9}
      />
    );
  },
};

export const Empty: Story = {
  render: () => {
    const [pageSize, setPageSize] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    return (
      <TablePagination
        totalItems={0}
        startIndex={0}
        endIndex={0}
        pageSize={pageSize}
        setPageSize={setPageSize}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        pageSizeOptions={DEFAULT_PAGE_SIZE_OPTIONS}
        totalPages={1}
      />
    );
  },
};

export const SinglePage: Story = {
  render: () => {
    const [pageSize, setPageSize] = useState(25);
    const [currentPage, setCurrentPage] = useState(1);
    return (
      <TablePagination
        totalItems={12}
        startIndex={0}
        endIndex={12}
        pageSize={pageSize}
        setPageSize={setPageSize}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        pageSizeOptions={DEFAULT_PAGE_SIZE_OPTIONS}
        totalPages={1}
      />
    );
  },
};

export const Interactive: Story = {
  render: () => {
    const totalItems = 234;
    const [pageSize, setPageSize] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    const totalPages = Math.ceil(totalItems / pageSize);
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = Math.min(startIndex + pageSize, totalItems);

    return (
      <TablePagination
        totalItems={totalItems}
        startIndex={startIndex}
        endIndex={endIndex}
        pageSize={pageSize}
        setPageSize={v => {
          setPageSize(typeof v === "function" ? v(pageSize) : v);
          setCurrentPage(1);
        }}
        currentPage={currentPage}
        setCurrentPage={v => setCurrentPage(typeof v === "function" ? v(currentPage) : v)}
        pageSizeOptions={DEFAULT_PAGE_SIZE_OPTIONS}
        totalPages={totalPages}
      />
    );
  },
};
