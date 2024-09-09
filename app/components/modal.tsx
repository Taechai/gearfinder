"use client";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
export default function Modal({
  title,
  Icon,
  children,
  isOpen,
  onClose,
}: {
  title?: string;
  Icon?: React.ComponentType<{
    className?: string;
  }>;
  children?: Readonly<React.ReactNode>;
  isOpen: boolean;
  onClose?: (value: boolean) => void;
}) {
  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-10"
        onClose={onClose ? onClose : () => {}}
      >
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-dark/20 backdrop-blur-[1px]" />
        </Transition.Child>
        <div className="fixed inset-0 flex min-h-full items-center justify-center p-[10px]">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-90"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <Dialog.Panel className="flex flex-col gap-[10px] w-fit min-w-[200px] max-w-lg transform overflow-hidden rounded-[10px] p-[10px] bg-white shadow-xl transition-all">
              <Dialog.Title
                as="h3"
                className="text-lg font-bold text-dark p-0 m-0 flex items-center justify-between gap-[10px]"
              >
                {title}
                {Icon && <Icon className="text-dark size-[20px]" />}
              </Dialog.Title>
              {children}
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
}
