interface GenericModalsPropsInterface {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

interface SolutionModalPropsInterface extends GenericModalsPropsInterface {
  scores: number[];
}

export { SolutionModalPropsInterface, GenericModalsPropsInterface };
