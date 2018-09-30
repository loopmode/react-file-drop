var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    }
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
import PropTypes from "prop-types";
import React from "react";
import dndDetails from "dnd-details";
import Events from "@loopmode/events";
var FileDrop = /** @class */ (function (_super) {
    __extends(FileDrop, _super);
    function FileDrop(props) {
        var _this = _super.call(this, props) || this;
        _this.resetDragging = function () {
            _this.frameDragCounter = 0;
            _this._isMounted && _this.setState({ draggingOverFrame: false, draggingOverTarget: false });
        };
        _this.handleWindowDragOverOrDrop = function (event) {
            // This prevents the browser from trying to load whatever file the user dropped on the window
            event.preventDefault();
        };
        _this.handleFrameDrag = function (event) {
            if (_this.props.disabled) {
                event.preventDefault();
                return;
            }
            // We are listening for events on the 'frame', so every time the user drags over any element in the frame's tree,
            // the event bubbles up to the frame. By keeping count of how many "dragenters" we get, we can tell if they are still
            // "draggingOverFrame" (b/c you get one "dragenter" initially, and one "dragenter"/one "dragleave" for every bubble)
            // This is far better than a "dragover" handler, which would be calling `setState` continuously.
            _this.frameDragCounter += event.type === "dragenter" ? 1 : -1;
            if (_this.frameDragCounter === 1) {
                _this._isMounted && _this.setState({ draggingOverFrame: true });
                if (_this.props.onFrameDragEnter)
                    _this.props.onFrameDragEnter(event);
                return;
            }
            if (_this.frameDragCounter === 0) {
                _this._isMounted && _this.setState({ draggingOverFrame: false });
                if (_this.props.onFrameDragLeave)
                    _this.props.onFrameDragLeave(event);
                return;
            }
        };
        _this.handleFrameDrop = function (event) {
            if (_this.props.disabled) {
                event.preventDefault();
                return;
            }
            if (!_this.state.draggingOverTarget) {
                _this.resetDragging();
                if (_this.props.onFrameDrop)
                    _this.props.onFrameDrop(event);
            }
        };
        _this.handleDragOver = function (event) {
            if (_this.props.disabled) {
                event.preventDefault();
                return;
            }
            _this._isMounted && _this.setState({ draggingOverTarget: true });
            if (!FileDrop.isIE())
                event.dataTransfer.dropEffect = _this.props.dropEffect;
            if (_this.props.onDragOver)
                _this.props.onDragOver(event);
        };
        _this.handleDragLeave = function (event) {
            if (_this.props.disabled) {
                event.preventDefault();
                return;
            }
            _this._isMounted && _this.setState({ draggingOverTarget: false });
            if (_this.props.onDragLeave)
                _this.props.onDragLeave(event);
        };
        _this.handleDrop = function (event) {
            if (_this.props.disabled) {
                event.preventDefault();
                return;
            }
            if (_this.props.onDrop) {
                var files = (event.dataTransfer && event.dataTransfer.files) || null;
                var details = void 0;
                try {
                    details = dndDetails(event);
                }
                catch (error) {
                    console.warn("Failed to retrieve details", error);
                }
                _this.props.onDrop(files, event, details);
            }
            _this.resetDragging();
        };
        _this.stopFrameListeners = function (frame) {
            Events.removeEventListener("dragenter", _this.handleFrameDrag, {
                target: frame
            });
            Events.removeEventListener("dragleave", _this.handleFrameDrag, {
                target: frame
            });
            Events.removeEventListener("drop", _this.handleFrameDrop, { target: frame });
        };
        _this.startFrameListeners = function (frame) {
            Events.addEventListener("dragenter", _this.handleFrameDrag, {
                target: frame
            });
            Events.addEventListener("dragleave", _this.handleFrameDrag, {
                target: frame
            });
            Events.addEventListener("drop", _this.handleFrameDrop, { target: frame });
        };
        _this.frameDragCounter = 0;
        _this.state = { draggingOverFrame: false, draggingOverTarget: false };
        return _this;
    }
    FileDrop.prototype.componentWillReceiveProps = function (nextProps) {
        if (nextProps.frame !== this.props.frame) {
            this.resetDragging();
            this.stopFrameListeners(this.props.frame);
            this.startFrameListeners(nextProps.frame);
        }
    };
    FileDrop.prototype.componentDidMount = function () {
        this._isMounted = true;
        this.startFrameListeners(this.props.frame);
        this.resetDragging();
        Events.addEventListener("dragover", this.handleWindowDragOverOrDrop);
        Events.addEventListener("drop", this.handleWindowDragOverOrDrop);
    };
    FileDrop.prototype.componentWillUnmount = function () {
        this._isMounted = false;
        this.stopFrameListeners(this.props.frame);
        Events.removeEventListener("dragover", this.handleWindowDragOverOrDrop);
        Events.removeEventListener("drop", this.handleWindowDragOverOrDrop);
    };
    FileDrop.prototype.render = function () {
        if (this.props.disabled) {
            return this.props.children;
        }
        var className = "file-drop";
        if (this.props.className)
            className += " " + this.props.className;
        if (this.props.disabled)
            className += " disabled";
        var fileDropTargetClassName = "file-drop-target";
        if (this.state.draggingOverFrame)
            fileDropTargetClassName += " file-drop-dragging-over-frame";
        if (this.state.draggingOverTarget)
            fileDropTargetClassName += " file-drop-dragging-over-target";
        var OuterComponent = this.props.outerComponent;
        var InnerComponent = this.props.innerComponent;
        return (React.createElement(OuterComponent, { className: className, onDragOver: this.handleDragOver, onDragLeave: this.handleDragLeave, onDrop: this.handleDrop },
            React.createElement(InnerComponent, { className: fileDropTargetClassName }, this.props.children)));
    };
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
            var prop = props[propName];
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
    FileDrop.isIE = function () {
        return window &&
            (window.navigator.userAgent.indexOf("MSIE") !== -1 ||
                window.navigator.appVersion.indexOf("Trident/") > 0);
    };
    // not used since not restricted to files
    // @author loopmode
    // @deprecated
    // @since 0.4.0
    FileDrop.eventHasFiles = function (event) {
        // In most browsers this is an array, but in IE11 it's an Object :(
        var hasFiles = false;
        var types = event.dataTransfer.types;
        for (var keyOrIndex in types) {
            if (types[keyOrIndex] === "Files") {
                hasFiles = true;
                break;
            }
        }
        return hasFiles;
    };
    return FileDrop;
}(React.PureComponent));
export default FileDrop;
