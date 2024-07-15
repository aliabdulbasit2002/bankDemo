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
import { PaystackButton } from 'react-paystack';

export default function AddMoney() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [amount, setAmount] = useState(0);

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
        setUserDetails(null);
        console.log("User is not logged in");
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const onSubmit = (data) => {
    console.log("Form data:", data);
  };

  const handlePaystackSuccessAction = async (response) => {
    console.log("Payment successful:", response);
    try {
      const userDocRef = doc(db, "users", auth.currentUser.uid);
      await updateDoc(userDocRef, {
        balance: increment(amount / 100),
      });
      alert('Payment successful');
      reset();
    } catch (error) {
      console.log("Error updating balance:", error);
    }
  };

  const handlePaystackCloseAction = () => {
    console.log('Payment closed');
    alert('Payment closed');
  };

  const paystackConfig = {
    email: userDetails?.email || '',
    amount: amount * 100,
    currency: 'GHS',
    publicKey: import.meta.env.PAYSTACK_PUBLIC_KEY,
    text: "Pay Now",
    onSuccess: (reference)=>handlePaystackSuccessAction(reference),
    onClose: handlePaystackCloseAction,
  };

  const handleFormSubmit = (data) => {
    console.log("Form submitted with data:", data);
    onSubmit(data);
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
            <form onSubmit={handleSubmit(handleFormSubmit)}>
              <ModalHeader className="flex flex-col gap-1">
                Add Money
              </ModalHeader>
              <ModalBody>
                <Input
                  label="Amount"
                  placeholder="Enter amount"
                  onChange={(e) => setAmount(Number(e.target.value))}
                  type="number"
                  variant="bordered"
                />
              </ModalBody>
              <ModalFooter>
                <PaystackButton {...paystackConfig} />
              </ModalFooter>
            </form>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
