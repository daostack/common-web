import React, { useState } from "react";
import { ComponentMeta } from "@storybook/react";
import { Button, ButtonVariant } from "../Button";
import { Popover } from "./Popover";
import {
  PopoverClose,
  PopoverContent,
  PopoverDescription,
  PopoverHeading,
  PopoverTrigger,
} from "./components";

export default {
  component: Popover,
  parameters: {
    layout: "centered",
  },
} as ComponentMeta<typeof Popover>;

export const Default = () => (
  <Popover>
    <PopoverTrigger>My trigger</PopoverTrigger>
    <PopoverContent>
      <PopoverHeading>My popover heading</PopoverHeading>
      <PopoverDescription>My popover description</PopoverDescription>
      <PopoverClose>Close</PopoverClose>
    </PopoverContent>
  </Popover>
);

export const Controlled = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger onClick={() => setIsOpen((v) => !v)}>
          My trigger
        </PopoverTrigger>
        <PopoverContent>
          <PopoverHeading>My popover heading</PopoverHeading>
          <PopoverDescription>My popover description</PopoverDescription>
          <PopoverClose>Close</PopoverClose>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export const WithCustomTrigger = () => (
  <Popover>
    <PopoverTrigger asChild>
      <Button variant={ButtonVariant.OutlineBlue}>Custom Trigger</Button>
    </PopoverTrigger>
    <PopoverContent>
      <PopoverHeading>My popover heading</PopoverHeading>
      <PopoverDescription>My popover description</PopoverDescription>
      <PopoverClose>Close</PopoverClose>
    </PopoverContent>
  </Popover>
);
