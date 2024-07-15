import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Input,
} from "@nextui-org/react";
import { useForm } from "react-hook-form";
import { IoIosSend } from "react-icons/io";

export default function SendMoney() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const onSubmit = async (data) => {
    console.log(data);

    reset();
  };

  return (
    <>
      <Button
        onPress={onOpen}
        color="primary"
        endContent={<IoIosSend />}
        className="rounded-sm col-span-1 "
      >
        Send Money
      </Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} placement="top-center">
        <ModalContent>
          {(onClose) => (
            <form onSubmit={handleSubmit(onSubmit)}>
              <ModalHeader className="flex flex-col gap-1">
                Send Money
              </ModalHeader>
              <ModalBody>
                <Input
                  autoFocus
                  label="Email"
                  type="email"
                  placeholder="Enter your email"
                  variant="bordered"
                  {...register("email", { required: true })}
                  isInvalid={errors.email ? true : false}
                  errorMessage="Please enter a valid email"
                />
                <Input
                  label="Amount"
                  placeholder="Enter amount"
                  type="number"
                  variant="bordered"
                  {...register("amount", { required: true })}
                  isInvalid={errors.amount ? true : false}
                  errorMessage="Please enter an amount above $10"
                />
              </ModalBody>
              <ModalFooter>
                <Button
                  color="primary"
                  onPress={errors ? null : onClose}
                  type="submit"
                  className="rounded-sm"
                >
                  Send
                </Button>
              </ModalFooter>
            </form>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
