/**
 * Neoliberalism Scene - The Entrepreneurial Self
 */

import React from "react";
import { ContentTemplate } from "../../templates/scenes";
import { COLORS } from "../../components/constants";

export const NeoliberalismScene: React.FC = () => {
  return (
    <ContentTemplate
      sectionLabel="THE HIDDEN IDEOLOGY"
      sectionLabelColor={COLORS.warning}
      title="The Entrepreneurial Self"
      titleIcon="🏢"
      content={[
        "In neoliberal societies, individuals are pressured to constantly upgrade themselves to survive in the market.",
        "Ulrich Bröckling calls this the 'entrepreneurial self' — treating yourself as a brand to market and human capital to manage.",
      ]}
      items={[
        { icon: "📈", text: "Constant self-optimization", color: COLORS.warning },
        { icon: "💼", text: "Self as brand", color: COLORS.warning },
        { icon: "⚠️", text: "Failure = Personal fault", color: COLORS.danger },
      ]}
      highlightContent="Self-help becomes a survival strategy, not a choice"
      highlightIcon="💡"
      durationInFrames={240}
    />
  );
};

export default NeoliberalismScene;
