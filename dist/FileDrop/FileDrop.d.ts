import PropTypes from "prop-types";
import React, { DragEvent as ReactDragEvent, DragEventHandler as ReactDragEventHandler } from "react";
export declare type TDropEffects = "copy" | "move" | "link" | "none";
export interface IDropDetails {
    files: FileList;
    links: string[];
    images: string[];
    text: string;
    html: string;
}
export interface IFileDropProps {
    className?: string;
    frame?: HTMLElement | Document;
    onFrameDragEnter?: (event: DragEvent) => void;
    onFrameDragLeave?: (event: DragEvent) => void;
    onFrameDrop?: (event: DragEvent) => void;
    onDragOver?: ReactDragEventHandler<HTMLDivElement>;
    onDragLeave?: ReactDragEventHandler<HTMLDivElement>;
    onDrop?: (files: FileList, event: ReactDragEvent<HTMLDivElement>, link: IDropDetails) => any;
    dropEffect?: TDropEffects;
    disabled?: boolean;
    outerComponent?: any;
    innerComponent?: any;
}
export interface IFileDropState {
    draggingOverFrame: boolean;
    draggingOverTarget: boolean;
}
declare class FileDrop extends React.PureComponent<IFileDropProps, IFileDropState> {
    static defaultProps: {
        dropEffect: TDropEffects;
        frame: Document;
        outerComponent: string;
        innerComponent: string;
    };
    static propTypes: {
        outerComponent: PropTypes.Requireable<string | ((...args: any[]) => any)>;
        innerComponent: PropTypes.Requireable<string | ((...args: any[]) => any)>;
        onDragOver: PropTypes.Requireable<(...args: any[]) => any>;
        onDragLeave: PropTypes.Requireable<(...args: any[]) => any>;
        onDrop: PropTypes.Requireable<(...args: any[]) => any>;
        dropEffect: PropTypes.Requireable<string>;
        frame: (props: any, propName: any, componentName: any) => Error;
        onFrameDragEnter: PropTypes.Requireable<(...args: any[]) => any>;
        onFrameDragLeave: PropTypes.Requireable<(...args: any[]) => any>;
        onFrameDrop: PropTypes.Requireable<(...args: any[]) => any>;
        disabled: PropTypes.Requireable<boolean>;
    };
    frameDragCounter: number;
    constructor(props: IFileDropProps);
    static isIE: () => boolean;
    static eventHasFiles: (event: DragEvent | React.DragEvent<HTMLElement>) => boolean;
    resetDragging: () => void;
    handleWindowDragOverOrDrop: (event: DragEvent) => void;
    handleFrameDrag: (event: DragEvent) => void;
    handleFrameDrop: (event: DragEvent) => void;
    handleDragOver: ReactDragEventHandler<HTMLDivElement>;
    handleDragLeave: ReactDragEventHandler<HTMLDivElement>;
    handleDrop: ReactDragEventHandler<HTMLDivElement>;
    stopFrameListeners: (frame: HTMLElement | Document) => void;
    startFrameListeners: (frame: HTMLElement | Document) => void;
    componentWillReceiveProps(nextProps: IFileDropProps): void;
    componentDidMount(): void;
    componentWillUnmount(): void;
    render(): JSX.Element;
}
export default FileDrop;
