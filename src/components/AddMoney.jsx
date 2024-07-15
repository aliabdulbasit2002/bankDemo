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
import { doc, getDoc, increment, updateDoc } from "firebase/firestore";
import { useForm } from "react-hook-form";
import { IoIosSend } from "react-icons/io";
import { auth, db } from "../firebase/config";
import { useEffect, useState } from "react";

export default function AddMoney() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setUserDetails(docSnap.data());
        } else {
          console.log("User data not found in Firestore");
        }
      } else {
        setUserDetails(null); // Clear userDetails if no user is authenticated
        console.log("User is not logged in");
      }
      setLoading(!loading);
    });

    return () => unsubscribe(); // Cleanup function to unsubscribe from onAuthStateChanged
  });

  const onSubmit = async (data) => {
    console.log(data);
    if (userDetails) {
      try {
        const userDocRef = doc(db, "users", auth.currentUser.uid);
        await updateDoc(userDocRef, {
          amount: increment(data.amount),
        });
      } catch (error) {
        console.log(error);
      }
    } else {
      console.log("User details not found");
    }
    reset();
  };

  return (
    <>
      <Button
        onPress={onOpen}
        color="primary"
        endContent={<IoIosSend />}
        className="rounded-sm col-span-1"
      >
        Add
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
                  {...register("amount", { required: true, min: 10 })}
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
                  onClick={onClose}
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
