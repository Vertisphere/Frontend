'use client'

import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button } from "@nextui-org/react"

interface Franchise {
    key: string;
    franchiseeLocation: string;
    managerName: string;
    dateEstablished: string;
    email: string;
}

interface DeleteFranchiseModalProps {
    franchise: Franchise | null;
    onClose: () => void;
    onDelete: (franchise: Franchise) => void;
}

export default function DeleteFranchiseModal({ franchise, onClose, onDelete }: DeleteFranchiseModalProps) {
    if (!franchise) return null

    const handleDelete = () => {
        onDelete(franchise)
        onClose()
    }

    return (
        <Modal isOpen={!!franchise} onClose={onClose}>
            <ModalContent>
                {(onClose) => (
                    <>
                        <ModalHeader className="flex flex-col gap-1">Confirm Deletion</ModalHeader>
                        <ModalBody>
                            <p>
                                Are you sure you want to delete the franchise at {franchise.franchiseeLocation}?
                                This action cannot be undone.
                            </p>
                        </ModalBody>
                        <ModalFooter>
                            <Button color="default" variant="light" onPress={onClose}>
                                Cancel
                            </Button>
                            <Button color="danger" onPress={handleDelete}>
                                Delete
                            </Button>
                        </ModalFooter>
                    </>
                )}
            </ModalContent>
        </Modal>
    )
}