# Supporters Flow

Page URL: `/commons/:commonId/support`

### Allowed query params:

- `amount` (e.g. `3000` means 30 ILS) - will skip amount selection part and go right to the auth or user details form;
- `language` - values: `en`, `he`. Specifies default language which will be used if translation for it exists in the configuration.

### Steps to set up supporters flow for a common:

1. Go to the Firebase Firestore Console. Collection `supporters`;
2. Add a new document, generate a random id and set up fields based on the JSON below.

### Supporters flow template:

```json
{
  "id": "8YlF8FACowJilipKWNiI",
  "commonId": "5bfa46db-5021-4821-9a6d-f831e85305a0",
  "photoURL": "https://picsum.photos/1000/300",
  "minAmount": 3000,
  "amounts": [3000, 5000, 10000, 15000],
  "displayedFields": [
    "aboutYou",
    "furtherSupportPlan",
    "marketingContentAgreement",
    "whatsappGroupAgreement"
  ],
  "defaultLocale": "en",
  "translations": {
    "en": {
      "title": "Dev-Test",
      "description": "The Dev-Test is a community movement managed via Common. Common members discuss and vote on decisions and expenses. For more details on how to be active in the community check out the Dev-Test common for more details on how to be active in the community.",
      "successPageDescription": "You’re now a Dead-Sea Guardian",
      "successPageInfoBlockDescription": "The Dead-Sea Guardians is a community movement managed via Common. Common members discuss and vote on decisions and expenses. For more details on how to be active in the community. Check out the Dead-Sea-Guardians common for more details on how to be active in the community.",
      "welcomePageDescription": "To the Dead-Sea-Guardians common",
      "welcomePageRulesDescription": "The common is a shared space for the Dead-Sea-Guardians community. ",
      "fields": {
        "aboutYou": {
          "label": "About you",
          "placeholder": "What are you most passionate about, really  good at, or love"
        },
        "furtherSupportPlan": {
          "label": "How could you support DSG further?",
          "placeholder": "Special skills, connections or other assets you have that could help accomplish the DSG mission"
        },
        "marketingContentAgreement": {
          "label": "Agree to receive marketing content"
        },
        "whatsappGroupAgreement": {
          "label": "Intersted to join DSG whatsapp group"
        }
      }
    },
    "he": {
      "title": "סעדיהaיחד מצילים את נחל סעדיה",
      "description": "נחל סעדיה שמורת טבע בלב העיר חיפה - 154 דונם של שטח אקולוגי ייחודי.  את האוצר הזה רוצים כיום להרוס לטובת בניית מתחמי הייטק ותעשייה. אנו נלחמים עבור: - ביטול/שינוי תוכנית הבנייה שאושרה על תוואי נחל סעדיה. - קידום פעולות שיקום של נחל סעדיה וסביבתו. - הפסקת זיהום הנחל.- הנגשת הנחל לציבור.  כעת אפשר לתרום לנחל סעדיה ב-Common: האתר מאפשר לקהילה להתגבש סביב דיון והעלאת רעיונות לקידום המאבק.  אנחנו מזמינים אתכם להצטרף ולהשמיע את קולכם, לשתף ברעיונות שלכם למען המאבק ולהשתתף בבחירת פרויקט שנוביל בעזרתכם. אנחנו מוכרחים להציל את נחל סעדיה, למעננו ולמען הדורות הבאים.",
      "successPageDescription": "תודה שהצטרפתם למעגל התומכים של הקומון יחד מצילים את נחל סעדיה",
      "successPageInfoBlockDescription": "יחד מצילים את נחל סעדיה היא תנועה קהילתית המנוהלת באמצעות אפליקציית קומון. החברים בקומון משתתפים בדיונים ומחליטים יחד על דרכי הפעולה.  אנחנו מזמינים אתכם להיכנס לעמוד הקהילה, להשמיע את קולכם, לשתף ברעיונות שלכם למען המאבק ולהשתתף בבחירת פרויקטים שנוביל בעזרתכם. ",
      "welcomePageDescription": "תודה שהצטרפתם למעגל התומכים של הקומון יחד מצילים את נחל סעדיה",
      "welcomePageRulesDescription": "המשותף הוא מרחב משותף לקהילת שומרי ים המלח.",
      "fields": {
        "aboutYou": {
          "label": "ספר/י על עצמך",
          "placeholder": "ברוכים הבאים, נשמח להכיר"
        },
        "furtherSupportPlan": {
          "label": "איך תוכלו לתמוך יותר בפעילות?",
          "placeholder": "מוזמנים לפרט האם תרצו לקחת חלק פעיל במאבק, ואם יש סט כישורים מיוחד שאתם יכולים לתרום"
        },
        "marketingContentAgreement": {
          "label": "הסכים לקבל תוכן שיווקי"
        },
        "whatsappGroupAgreement": {
          "label": "מעוניינים להצטרף לקבוצת ווטסאפ שלנו"
        }
      }
    }
  }
}
```
