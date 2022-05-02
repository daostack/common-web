import React, { FC } from "react";
import { Button, ButtonVariant } from "@/shared/components";
import "./index.scss";

interface AddingCardProps {
  text: string;
  imageSrc: string;
  imageAlt: string;
  buttonText: string;
  onClick: () => void;
}

const AddingCard: FC<AddingCardProps> = (props) => {
  const { text, imageSrc, imageAlt, buttonText, onClick } = props;

  return (
    <div className="billing-adding-card">
      <img
        className="billing-adding-card__image"
        src={imageSrc}
        alt={imageAlt}
      />
      <p className="billing-adding-card__text">{text}</p>
      <Button
        className="billing-adding-card__button"
        variant={ButtonVariant.Secondary}
        onClick={onClick}
      >
        {buttonText}
      </Button>
    </div>
  );
};

export default AddingCard;
