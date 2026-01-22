/**
 * Entrepreneurial Self Scene - Bröckling's concept
 */

import React from "react";
import { QuoteTemplate } from "../../templates/scenes";
import { SCENE_DURATIONS } from "../constants";

export const EntrepreneurialSelfScene: React.FC = () => {
  return (
    <QuoteTemplate
      icon="🏢"
      quote="The entrepreneurial self must constantly market, optimize, and upgrade itself as human capital."
      attribution="Ulrich Bröckling, The Entrepreneurial Self"
      background="dark"
      showQuoteMarks={true}
      context="You become a brand to manage, a product to improve, an investment to optimize. Self-help isn't a choice—it's a survival strategy in a competitive market."
      durationInFrames={SCENE_DURATIONS.ENTREPRENEURIAL_SELF}
    />
  );
};

export default EntrepreneurialSelfScene;
