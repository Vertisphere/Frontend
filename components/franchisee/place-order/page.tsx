'use client'

import React, {useEffect, useMemo} from "react";
import {
    Button,
    Card,
    CardBody,
    CardHeader,
    Chip,
    Divider,
    Input,
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader,
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@nextui-org/react";
import {MinusIcon, PlusIcon} from "@radix-ui/react-icons";
import {ProductOrder} from "@/lib/franchiseeStore/data";
import CustomPagination from "@/components/CustomPagination/page";
import {useSortedFilteredItems} from "@/components/hooks/useSortedFilteredItems";
import {Badge} from "@nextui-org/badge";
import {CartIcon} from "@nextui-org/shared-icons";
import Receipt from "@/components/receipts/page";
import {usePlaceOrderStore} from '@/lib/franchiseeStore/store';
import ReusableTable from "@/components/table/reusable-table";

const columns = [
    {key: "product", label: "PRODUCT", sortable: true},
    {key: "quantity", label: "QUANTITY", sortable: true},
    {key: "sku", label: "SKU", sortable: true},
    {key: "pricePerUnit", label: "PRICE PER UNIT", sortable: true},
    {key: "stockStatus", label: "STOCK STATUS", sortable: true},
];

const statusConfig = {
    "In-Stock Item": {color: "success", variant: "solid", className: "bg-[#e4ffe4] text-[#1fac1c]"},
    "Out of Stock": {color: "danger", variant: "solid", className: "bg-[#feebec] text-[#ce292e]"},
};

export default function PlaceOrderTable() {
    const {
        orderList,
        selectedKeys,
        page,
        productFilter,
        skuFilter,
        selectedOrders,
        cartCount,
        orderId,
        currentDate,
        showOrderModal,
        modalTimer,
        showNoItemsPopover,
        sortDescriptor,
        setPage,
        setProductFilter,
        setSkuFilter,
        setOrderId,
        setCurrentDate,
        setShowOrderModal,
        setModalTimer,
        setShowNoItemsPopover,
        setSortDescriptor,
        handleQuantityChange,
        handleSelectionChange,
        handlePlaceOrder,
        handleCloseModal
    } = usePlaceOrderStore();

    useEffect(() => {
        setOrderId(new Date().getTime().toString().slice(-6));
        setCurrentDate(new Date().toLocaleDateString());
    }, [setOrderId, setCurrentDate]);

    useEffect(() => {
        if (showOrderModal) {
            const timer = setInterval(() => {
                setModalTimer((prev: number) => {
                    if (prev <= 1) {
                        clearInterval(timer);
                        setShowOrderModal(false);
                        return 10;
                    }
                    return prev - 1;
                });
            }, 1000);
            return () => clearInterval(timer);
        }
    }, [showOrderModal, setModalTimer, setShowOrderModal]);

    const filters = {product: productFilter, sku: skuFilter};
    const sortedItems = useSortedFilteredItems(orderList, filters, sortDescriptor, ["product", "sku"]);

    const rowsPerPage = 5;
    const pages = Math.ceil(sortedItems.length / rowsPerPage);
    const items = useMemo(() => {
        const start = (page - 1) * rowsPerPage;
        const end = start + rowsPerPage;
        return sortedItems.slice(start, end);
    }, [page, sortedItems]);

    const renderCell = (order: ProductOrder, columnKey: React.Key) => {
        switch (columnKey) {
            case "quantity":
                return (
                    <div className="flex items-center gap-2">
                        <Button
                            isIconOnly
                            size="sm"
                            radius="sm"
                            variant="light"
                            onClick={() => handleQuantityChange(order.key, false)}
                            className="min-w-6 w-6 h-6 border border-default-200"
                        >
                            <MinusIcon className="w-4 h-4"/>
                        </Button>
                        <span className="w-8 text-center">{order.quantity}</span>
                        <Button
                            isIconOnly
                            size="sm"
                            radius="sm"
                            variant="light"
                            onClick={() => handleQuantityChange(order.key, true)}
                            className="min-w-6 w-6 h-6 border border-default-200"
                        >
                            <PlusIcon className="w-4 h-4"/>
                        </Button>
                    </div>
                );
            case "stockStatus":
                const config = statusConfig[order.stockStatus] || statusConfig["In-Stock Item"];
                return <Chip className={config.className} size="sm">{order.stockStatus}</Chip>;
            default:
                return order[columnKey as keyof ProductOrder];
        }
    };

    return (
        <div className="flex gap-6 flex-col md:flex-row">
            <Card className="flex-1">
                <CardHeader className="mt-6">
                    <div className="flex space-x-4 mx-6">
                        <Badge color="primary" content={cartCount} shape="circle">
                            <CartIcon size={30}/>
                        </Badge>
                        <Input
                            placeholder="Search by Product"
                            value={productFilter}
                            onChange={(e) => setProductFilter(e.target.value)}
                        />
                        <Input
                            placeholder="Search by SKU"
                            value={skuFilter}
                            onChange={(e) => setSkuFilter(e.target.value)}
                        />
                    </div>
                </CardHeader>
                <CardBody>
                    <ReusableTable
                        columns={columns}
                        items={items}
                        selectedKeys={selectedKeys}
                        handleSelectionChange={(keys: Set<React.Key>) => handleSelectionChange(keys)}
                        sortDescriptor={sortDescriptor}
                        setSortDescriptor={(descriptor: {
                            column: string;
                            direction: "ascending" | "descending"
                        }) => setSortDescriptor(descriptor)}
                        renderCell={renderCell}
                    />
                </CardBody>
                <Divider/>
                <CardBody>
                    <div className="flex justify-between items-center">
                        <CustomPagination
                            page={page}
                            pages={pages}
                            rowsPerPage={rowsPerPage}
                            totalItems={sortedItems.length}
                            onPageChange={setPage}
                        />

                        <Popover isOpen={showNoItemsPopover && selectedOrders.length === 0}
                                 onOpenChange={(open) => setShowNoItemsPopover(open)}>
                            <PopoverTrigger>
                                <Button color="primary" size="sm" onClick={handlePlaceOrder}>Place Order</Button>
                            </PopoverTrigger>
                            <PopoverContent>
                                <div className="px-1 py-2">
                                    <div className="text-small font-semibold">No Items Selected</div>
                                    <div className="text-tiny">Please select items before placing an order.</div>
                                </div>
                            </PopoverContent>
                        </Popover>

                        <Modal isOpen={showOrderModal} onClose={handleCloseModal}>
                            <ModalContent>
                                <ModalHeader>Order Placed Successfully</ModalHeader>
                                <ModalBody>
                                    Your order has been placed. You can view it on the Order History page.
                                    This message will close in {modalTimer} seconds.
                                </ModalBody>
                                <ModalFooter>
                                    <Button color="primary" radius="sm" onPress={handleCloseModal}>Close</Button>
                                </ModalFooter>
                            </ModalContent>
                        </Modal>
                    </div>
                </CardBody>
            </Card>

            <Receipt orderId={orderId} currentDate={currentDate} selectedOrders={selectedOrders}/>
        </div>
    );
}