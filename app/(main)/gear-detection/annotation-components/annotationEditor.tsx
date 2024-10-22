"use client";
import Button from "@/app/components/button";
import InputText from "@/app/components/inputText";
import { CategoryIcon, SaveIcon } from "@/app/icons/myIcons";
import { CheckCircleIcon, TrashIcon } from "@heroicons/react/20/solid";
import { Dialog, Transition } from "@headlessui/react";
import {
  ChangeEvent,
  Fragment,
  RefObject,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  Annotation,
  annotationsAtom,
  isDrawingEnabledAtom,
  isPanningEnabledAtom,
} from "./atoms/annotationAtoms";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { projectClassesAtom } from "../../projectAtom";

export default function AnnotationEditor({
  isOpen,
  initialValue = "",
  annotation,
  onClose,
  containerRef,
}: {
  isOpen: boolean;
  initialValue?: string;
  onClose: () => void;
  containerRef: RefObject<HTMLDivElement>;
  annotation: Annotation;
}) {
  const { top, left, width, height } = containerRef.current
    ? {
        top: containerRef.current.getBoundingClientRect().top - 10,
        left: containerRef.current.getBoundingClientRect().left - 10,
        width: containerRef.current.getBoundingClientRect().width + 20,
        height: containerRef.current.getBoundingClientRect().height + 20,
      }
    : {
        top: "10px",
        left: "10px",
        width: "fit-content",
        height: "fit-content",
      };
  const [textValue, setTextValue] = useState("");
  const setAnnotations = useSetRecoilState(annotationsAtom);
  const [isDrawingEnabled, setIsDrawingEnabled] =
    useRecoilState(isDrawingEnabledAtom);
  const [isPanningEnabled, setIsPanningEnabled] =
    useRecoilState(isPanningEnabledAtom);
  const [wasDrawingEnabled, setWasDrawingEnabled] = useState(false);
  const [wasPanningEnabled, setWasPanningEnabled] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleBeforeEnter = () => {
    if (inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  };
  const [projectClasses, setProjectClasses] =
    useRecoilState(projectClassesAtom);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [selectedSuggestion, setSelectedSuggestion] = useState("");
  const [selectionStart, setSelectionStart] = useState(0);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const newSelectionStart = inputRef.current?.selectionStart || 0;
    const isDeleting = newSelectionStart <= selectionStart;
    setSelectionStart(newSelectionStart);
    setTextValue(value);

    // Filter suggestions based on the input
    const matchedSuggestions = projectClasses.filter((suggestion) =>
      suggestion.toLowerCase().startsWith(value.toLowerCase())
    );
    setSuggestions(matchedSuggestions);

    if (matchedSuggestions.length > 0 && !isDeleting) {
      const suggestion = matchedSuggestions[0];

      // Auto-complete
      setTextValue(suggestion);
      setSelectedSuggestion(suggestion);

      // Select the remaining part of the suggestion
      if (inputRef.current) {
        inputRef.current.value = suggestion;
        inputRef.current.setSelectionRange(value.length, suggestion.length);
      }
    } else {
      setSelectedSuggestion("");
    }
  };

  const handleSaveAnnotation = (e: React.MouseEvent) => {
    e.preventDefault();
    if (textValue.trim() == "") {
      inputRef.current?.focus();
      return;
    }
    setAnnotations((prevAnnotations) =>
      prevAnnotations.map((annot) =>
        annot.id === annotation.id
          ? { ...annot, className: textValue.trim() }
          : annot
      )
    );
    setProjectClasses((prevProjectClasses) => {
      return Array.from(new Set([...prevProjectClasses, textValue.trim()]));
    });

    setIsDrawingEnabled(wasDrawingEnabled);
    setIsPanningEnabled(wasPanningEnabled);
    onClose();
  };

  const handleDeleteAnnotation = () => {
    setAnnotations((prevAnnotations) =>
      prevAnnotations.filter(({ id }) => id != annotation.id)
    );
    setIsDrawingEnabled(wasDrawingEnabled);
    setIsPanningEnabled(wasPanningEnabled);
    onClose();
  };

  const handleDialogClose = () => {
    if (annotation.className.trim() == "") {
      setAnnotations((prevAnnotations) =>
        prevAnnotations.map((annot) =>
          annot.id === annotation.id
            ? { ...annot, className: "Unnamed" }
            : annot
        )
      );
      setProjectClasses((prevProjectClasses) => {
        return Array.from(new Set([...prevProjectClasses, "Unnamed"]));
      });
    }
    setIsDrawingEnabled(wasDrawingEnabled);
    setIsPanningEnabled(wasPanningEnabled);
    onClose();
  };

  const handleRadioChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSelectedSuggestion(e.target.value);
    setTextValue(e.target.value);
    inputRef.current?.focus();
  };

  useEffect(() => {
    if (isOpen) {
      if (initialValue != "") {
        setTextValue(initialValue);
      } else {
        setTextValue(projectClasses.length > 0 ? projectClasses[0] : "");
      }
      setSuggestions(
        projectClasses.filter((suggestion) =>
          suggestion.toLowerCase().startsWith(initialValue.toLowerCase())
        )
      );
      setSelectedSuggestion(initialValue);

      //   Check if the user was previously drawing or panning
      setWasDrawingEnabled(isDrawingEnabled);
      setWasPanningEnabled(isPanningEnabled);
      if (annotation.className.trim() == "") {
        setIsDrawingEnabled(false);
      }
      setIsPanningEnabled(false);
    }
  }, [isOpen]);

  return (
    <Transition
      appear
      show={isOpen}
      as={Fragment}
      beforeEnter={handleBeforeEnter}
    >
      <Dialog
        as="div"
        className="absolute z-10"
        style={{
          top,
          left,
          width,
          height,
        }}
        onClose={handleDialogClose}
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
          <div className="absolute top-0 left-0 inset-0 bg-dark/1 rounded-[10px] backdrop-blur-[0.5px]" />
        </Transition.Child>

        <div className="absolute top-[10px] left-[10px] flex items-center justify-center">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-90"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <Dialog.Panel className="w-fit min-w-[200px] max-w-lg transform overflow-hidden rounded-[10px] p-[10px] bg-white shadow-xl transition-all">
              <form className="flex flex-col gap-[10px] ">
                <Dialog.Title
                  as="h3"
                  className="text-lg font-bold text-dark p-0 m-0 flex items-center justify-between gap-[10px]"
                >
                  Annotation Editor
                </Dialog.Title>
                <InputText
                  id="className"
                  name="className"
                  value={textValue}
                  type="text"
                  placeholder="Class Name"
                  Icon={CategoryIcon}
                  removeIconBg
                  otherTwClass={"min-w-[250px]"}
                  inputRef={inputRef}
                  onChange={handleChange}
                />
                <div className="w-full flex justify-between gap-[10px]">
                  <Button
                    Icon={TrashIcon}
                    otherTwClass={
                      "bg-error-light/50 !text-error-dark !font-bold w-full"
                    }
                    twHover="hover:bg-error-light/60"
                    twFocus="focus:ring-[3px] focus:ring-error-dark/50"
                    onClick={handleDeleteAnnotation}
                    btnType="button"
                  />
                  <Button
                    Icon={SaveIcon}
                    otherTwClass={
                      "bg-success-light/50 !text-success-dark !font-bold w-full"
                    }
                    twHover="hover:bg-success-light/60"
                    twFocus="focus:ring-[3px] focus:ring-success-dark/50"
                    btnType="submit"
                    onClick={handleSaveAnnotation}
                  />
                </div>
              </form>
              {suggestions.length > 0 && (
                <div className="flex flex-col gap-[5px] mt-[10px] max-h-[124px] overflow-auto">
                  {suggestions.map((suggestion) => (
                    <label
                      key={suggestion}
                      htmlFor={suggestion}
                      className={`relative flex flex-row gap-[10px] justify-center items-center transition-all duration-300 cursor-pointer`}
                    >
                      <input
                        id={suggestion}
                        type="radio"
                        name={"AnnotationClasses"}
                        className="absolute z-[-1] size-full appearance-none outline-none peer/radio "
                        onChange={handleRadioChange}
                        value={suggestion}
                        checked={suggestion == selectedSuggestion}
                      />
                      <CheckCircleIcon className="size-[15px] opacity-0 scale-90 text-dark hover:scale-110 cursor-pointer transition-all duration-300 ease-in-out peer-checked/radio:opacity-100 peer-checked/radio:scale-100" />
                      <p
                        className={`w-full pointer-events-auto peer bg-transparent text-sm text-dark/50 peer-checked/radio:text-dark font-normal`}
                      >
                        {suggestion}
                      </p>
                    </label>
                  ))}
                </div>
              )}
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
}
