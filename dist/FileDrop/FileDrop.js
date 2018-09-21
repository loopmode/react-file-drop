import PropTypes from "prop-types";
import React from "react";
import dndDetails from "dnd-details";
import Events from "@loopmode/events";
class FileDrop extends React.PureComponent {
    constructor(props) {
        super(props);
        this.resetDragging = () => {
            this.frameDragCounter = 0;
            this.setState({ draggingOverFrame: false, draggingOverTarget: false });
        };
        this.handleWindowDragOverOrDrop = (event) => {
            // This prevents the browser from trying to load whatever file the user dropped on the window
            event.preventDefault();
        };
        this.handleFrameDrag = (event) => {
            if (this.props.disabled) {
                event.preventDefault();
                return;
            }
            // We are listening for events on the 'frame', so every time the user drags over any element in the frame's tree,
            // the event bubbles up to the frame. By keeping count of how many "dragenters" we get, we can tell if they are still
            // "draggingOverFrame" (b/c you get one "dragenter" initially, and one "dragenter"/one "dragleave" for every bubble)
            // This is far better than a "dragover" handler, which would be calling `setState` continuously.
            this.frameDragCounter += event.type === "dragenter" ? 1 : -1;
            if (this.frameDragCounter === 1) {
                this.setState({ draggingOverFrame: true });
                if (this.props.onFrameDragEnter)
                    this.props.onFrameDragEnter(event);
                return;
            }
            if (this.frameDragCounter === 0) {
                this.setState({ draggingOverFrame: false });
                if (this.props.onFrameDragLeave)
                    this.props.onFrameDragLeave(event);
                return;
            }
        };
        this.handleFrameDrop = (event) => {
            if (this.props.disabled) {
                event.preventDefault();
                return;
            }
            if (!this.state.draggingOverTarget) {
                this.resetDragging();
                if (this.props.onFrameDrop)
                    this.props.onFrameDrop(event);
            }
        };
        this.handleDragOver = event => {
            if (this.props.disabled) {
                event.preventDefault();
                return;
            }
            this.setState({ draggingOverTarget: true });
            if (!FileDrop.isIE())
                event.dataTransfer.dropEffect = this.props.dropEffect;
            if (this.props.onDragOver)
                this.props.onDragOver(event);
        };
        this.handleDragLeave = event => {
            if (this.props.disabled) {
                event.preventDefault();
                return;
            }
            this.setState({ draggingOverTarget: false });
            if (this.props.onDragLeave)
                this.props.onDragLeave(event);
        };
        this.handleDrop = event => {
            if (this.props.disabled) {
                event.preventDefault();
                return;
            }
            if (this.props.onDrop) {
                const files = (event.dataTransfer && event.dataTransfer.files) || null;
                let details;
                try {
                    details = dndDetails(event);
                }
                catch (error) {
                    console.warn("Failed to retrieve details", error);
                }
                this.props.onDrop(files, event, details);
            }
            this.resetDragging();
        };
        this.stopFrameListeners = (frame) => {
            Events.removeEventListener("dragenter", this.handleFrameDrag, {
                target: frame
            });
            Events.removeEventListener("dragleave", this.handleFrameDrag, {
                target: frame
            });
            Events.removeEventListener("drop", this.handleFrameDrop, { target: frame });
        };
        this.startFrameListeners = (frame) => {
            Events.addEventListener("dragenter", this.handleFrameDrag, {
                target: frame
            });
            Events.addEventListener("dragleave", this.handleFrameDrag, {
                target: frame
            });
            Events.addEventListener("drop", this.handleFrameDrop, { target: frame });
        };
        this.frameDragCounter = 0;
        this.state = { draggingOverFrame: false, draggingOverTarget: false };
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.frame !== this.props.frame) {
            this.resetDragging();
            this.stopFrameListeners(this.props.frame);
            this.startFrameListeners(nextProps.frame);
        }
    }
    componentDidMount() {
        this.startFrameListeners(this.props.frame);
        this.resetDragging();
        Events.addEventListener("dragover", this.handleWindowDragOverOrDrop);
        Events.addEventListener("drop", this.handleWindowDragOverOrDrop);
    }
    componentWillUnmount() {
        this.stopFrameListeners(this.props.frame);
        Events.removeEventListener("dragover", this.handleWindowDragOverOrDrop);
        Events.removeEventListener("drop", this.handleWindowDragOverOrDrop);
    }
    render() {
        let className = "file-drop";
        if (this.props.className)
            className += " " + this.props.className;
        if (this.props.disabled)
            className += " disabled";
        let fileDropTargetClassName = "file-drop-target";
        if (this.state.draggingOverFrame)
            fileDropTargetClassName += " file-drop-dragging-over-frame";
        if (this.state.draggingOverTarget)
            fileDropTargetClassName += " file-drop-dragging-over-target";
        const OuterComponent = this.props.outerComponent;
        const InnerComponent = this.props.innerComponent;
        return (React.createElement(OuterComponent, { className: className, onDragOver: this.handleDragOver, onDragLeave: this.handleDragLeave, onDrop: this.handleDrop },
            React.createElement(InnerComponent, { className: fileDropTargetClassName }, this.props.children)));
    }
}
FileDrop.defaultProps = {
    dropEffect: "copy",
    frame: window ? window.document : undefined,
    outerComponent: "div",
    innerComponent: "div"
};
FileDrop.propTypes = {
    outerComponent: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
    innerComponent: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
    onDragOver: PropTypes.func,
    onDragLeave: PropTypes.func,
    onDrop: PropTypes.func,
    dropEffect: PropTypes.oneOf(["copy", "move", "link", "none"]),
    frame: function (props, propName, componentName) {
        const prop = props[propName];
        if (prop == null) {
            return new Error("Warning: Required prop `" +
                propName +
                "` was not specified in `" +
                componentName +
                "`");
        }
        if (prop !== document &&
            prop !== window &&
            !(prop instanceof HTMLElement)) {
            return new Error("Warning: Prop `" +
                propName +
                "` must be one of the following: document, HTMLElement!");
        }
    },
    onFrameDragEnter: PropTypes.func,
    onFrameDragLeave: PropTypes.func,
    onFrameDrop: PropTypes.func,
    disabled: PropTypes.bool
};
FileDrop.isIE = () => window &&
    (window.navigator.userAgent.indexOf("MSIE") !== -1 ||
        window.navigator.appVersion.indexOf("Trident/") > 0);
// not used since not restricted to files
// @author loopmode
// @deprecated
// @since 0.4.0
FileDrop.eventHasFiles = (event) => {
    // In most browsers this is an array, but in IE11 it's an Object :(
    let hasFiles = false;
    const types = event.dataTransfer.types;
    for (const keyOrIndex in types) {
        if (types[keyOrIndex] === "Files") {
            hasFiles = true;
            break;
        }
    }
    return hasFiles;
};
export default FileDrop;
