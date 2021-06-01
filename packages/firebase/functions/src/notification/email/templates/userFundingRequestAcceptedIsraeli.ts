import { testFlag } from '../../helpers';

const template = `<div dir="auto">
היי {{userName}}, ברכות!
<br /><br />
ההצעה שלך, “{{proposal}}”, ב“{{commonName}}” - אושרה.
<br /><br />
כדי להעביר את הכסף לחשבון הבנק שלך בשקלים, נצטרך את עזרתך בהשלמת הפעולות הבאות:
<br /><br />
1) רישום באתר <a href="https://www.bitsofgold.co.il/signup">“ביטס אוף גולד”</a>
<br /><br />2) הוספת פרטי חשבון הבנק תחת <a href="https://www.bitsofgold.co.il/profile/settings/">“הפרופיל שלי”</a>
<br /><br />
<sub>*ביטס אוף גולד הוא נותן שירותים פיננסיים המטפל בתשלומים של קומון בישראל.</sub>
<br /><br />
אחרי השלמת הרישום, <b>אנא השיבו למייל זה על מנת שנוכל להעביר את התשלום.</b> הכסף יועבר לחשבונכם תוך 7 ימי עסקים מהשלמת הרישום, ומייל עדכון ישלח אליכם.
<br /><br />
שימו לב:
<br /><br />
- התשלום לא יתבצע עד השלמת הרישום באתר “ביטס אוף גולד”. <b>אנא השיבו במייל חוזר לאחר השלמת הרישום.</b>
<br /><br />
- כחלק מהכללים בקומון ויצירת שקיפות שהכסף אכן שימש את המטרה שלשמה נועד, <b>על מקבל הכסף לשלוח למייל זה חשבונית מס / קבלה לאחר ביצוע התשלום שאושר על ידי הקומון.</b>
<br /><br />
- את הכספים המתקבלים מהקומון <b>ניתן להעביר רק לעסקים הרשומים כחוק ופטורים מניכוי מס במקור, או לעמותות רשומות.</b> לפני העברת הכספים לעסק או עמותה, יש לוודא פרטים אלה.
<br /><br />
<br /><br />

מספר סידורי: {{proposalId}}
<br />
סכום לתשלום: {{fundingAmount}}

<br /><br />
<br /><br />
תודה,
<br />
צוות Common
<br />
({{fromEmail}})
</div>
`;

const emailStubs = {
  userName: {
    required: true
  },
  proposal: {
    required: true
  },
  fundingAmount: {
    required: true
  },
  commonName: {
    required: true
  },
  supportChatLink: {
    required: true
  },
  proposalId: {
    required: true
  },
  fromEmail: {
    required: true
  },
};

export const userFundingRequestAcceptedIsraeli = {
  subject: `${testFlag()} ההצעה שלך ב- Common אושרה!`,
  emailStubs,
  template
};
