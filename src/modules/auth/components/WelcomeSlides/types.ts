export type SlideData = {
  id: string;
  icon: string;
  headline: string;
  description: string;
};

export type WelcomeSlidesProps = {
  slides: SlideData[];
  activeIndex: number;
  onIndexChange: (index: number) => void;
};
