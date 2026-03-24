export interface Submission {
  id?: string;
  full_name: string;
  directed_to: string;
  reason: string;
  q1: string;
  q2: string;
  q3: string;
  q4: string;
  q5: string;
  q6: string;
  q7: string;
  q8: string;
  created_at: string;
  has_experienced_scam: boolean;
}

export const DIRECTED_TO_OPTIONS = [
  "Mohammed Rafie",
  "Rachid El Edrissi",
  "Mustapha Atyq",
  "Mohamed Hadid",
  "Bilal Ait Mossaddak",
  "Hayat Chawki",
  "Mouhssin Az'zaim"
];

export const QUESTIONS = [
  "How do you personally define trust in the digital world?",
  "What makes you feel secure when interacting with someone online?",
  "Describe your reaction when a stranger initiates contact with you digitally.",
  "Have you ever experienced deception, manipulation, or fraud online? If yes, describe what happened and how it affected you.",
  "Do you think people show their true personalities online? Why or why not?",
  "What do you consider the biggest risks in digital communication?",
  "How has technology changed the way you evaluate trust?",
  "What advice would you give others about protecting themselves online?"
];
