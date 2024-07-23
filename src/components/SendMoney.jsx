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
import { doc, getDoc, updateDoc, increment, query, where, getDocs, collection } from "firebase/firestore";
import { auth, db } from "../firebase/config";
import { useEffect, useState } from "react";

export default function SendMoney() {
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
        setUserDetails(null);
        console.log("User is not logged in");
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const onSubmit = async (data) => {
    const { email, amount } = data;
    const amountNumber = Number(amount);

    if (amountNumber <= 0) {
      alert("Please enter a valid amount");
      return;
    }

    if (userDetails.balance < amountNumber) {
      alert("Insufficient balance");
      return;
    }

    try {
      // Need to check if recipient exists
      const usersCollection = collection(db, "users");
      const recipientQuery = query(usersCollection, where("email", "==", email));
      const recipientSnapshot = await getDocs(recipientQuery);

      if (recipientSnapshot.empty) {
        alert("Recipient not found");
        return;
      }

      const recipientDocRef = recipientSnapshot.docs[0].ref;

      // So here we will deduct amount from sender balance
      const senderDocRef = doc(db, "users", auth.currentUser.uid);
      await updateDoc(senderDocRef, {
        balance: increment(-amountNumber),
      });

      // Add that amount to recipient balance
      await updateDoc(recipientDocRef, {
        balance: increment(amountNumber),
      });

      alert("Money sent successfully");
      onOpenChange(false); 
      reset();
    } catch (error) {
      console.error("Error sending money:", error);
      alert("Error sending money");
    }
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
                  placeholder="Enter recipient's email"
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
                  errorMessage="Please enter a valid amount"
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
