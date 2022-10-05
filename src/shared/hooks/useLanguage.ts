import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import i18n from "@/i18n";
import { Language } from "@/shared/constants";
import { changeLanguage as changeLanguageAction } from "@/shared/store/actions";
import { selectLanguage } from "@/shared/store/selectors";

interface Return {
  language: Language;
  changeLanguage: (language: Language) => void;
}

export const useLanguage = (): Return => {
  const dispatch = useDispatch();
  const language = useSelector(selectLanguage());

  const changeLanguage = useCallback(
    async (language: Language) => {
      await i18n.changeLanguage(language);
      dispatch(changeLanguageAction(language));
    },
    [dispatch]
  );

  return {
    language,
    changeLanguage,
  };
};
