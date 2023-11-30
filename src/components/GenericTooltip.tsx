import React, { ReactNode, useState, useEffect, ReactElement } from 'react';
import { Tooltip } from 'react-tooltip';
import 'react-tooltip/dist/react-tooltip.css';
import ReactDOMServer from 'react-dom/server';

interface TooltipProps {
  children: ReactNode;
  color: string;
  content: ReactElement;
}

const generateRandomString = (): string => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';

  for (let i = 0; i < 6; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    result += characters.charAt(randomIndex);
  }

  return result;
};

const GenericTooltip: React.FC<TooltipProps> = ({ children, color, content }) => {
  const [id, setId] = useState<string>(generateRandomString());

  useEffect(() => {
    setId(generateRandomString());
  }, []);

  const tooltipContent = content ? ReactDOMServer.renderToStaticMarkup(content) : '';

  return (
    <div className="flex flex-row items-center justify-center w-fit h-fit" data-tooltip-id={id} data-tooltip-html={tooltipContent}>
      {children}
      <Tooltip id={id} opacity={1} style={{
		backgroundColor: color,
		opacity: 1,
		maxWidth: "20rem",
		borderRadius: "0.75rem"
	  }}/>
    </div>
  );
};

export default GenericTooltip;
