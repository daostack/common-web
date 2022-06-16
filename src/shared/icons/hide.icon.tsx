import React, { ReactElement } from "react";

interface ShareIconProps {
    className?: string;
}

export default function HideIcon({ className }: ShareIconProps): ReactElement {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" className={className}>
            <g fill="none" fill-rule="evenodd">
                <g         fill="#FF603E" fill-rule="nonzero">
                    <g>
                        <path d="M14.348 3.076c.39.39.39 1.023 0 1.414l-.777.777c.761.665 1.499 1.477 2.211 2.435.113.151.13.351.049.517l-.049.08-.234.308C13.278 11.536 10.761 13 8 13c-.652 0-1.29-.082-1.916-.245l-1.636 1.634c-.39.39-1.023.39-1.414 0-.39-.39-.39-1.023 0-1.414l9.9-9.9c.39-.39 1.023-.39 1.414 0zm-3.354 4.767l-3.152 3.153c.052.003.105.004.158.004 1.657 0 3-1.343 3-3l-.006-.157zM8 3c.658 0 1.302.083 1.933.25L8.175 5.005C8.117 5.002 8.06 5 8 5 6.343 5 5 6.343 5 8l.005.175-2.566 2.567C1.674 10.075.934 9.26.218 8.298c-.113-.151-.13-.351-.049-.517l.049-.08.234-.308C2.722 4.464 5.239 3 8 3z" transform="translate(-366 -555) translate(366 555)"/>
                    </g>
                </g>
            </g>
        </svg>

    );
}
