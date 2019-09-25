import React, { Component } from 'react';
import { Editor, EditorState, RichUtils } from 'draft-js';
import './CustomDraft.scss';

class CustomDraft extends Component {
    constructor(props){
        super(props);
        this.state = {
            editorState: EditorState.createEmpty()
        };

        this.onChange = this.onChange.bind(this);
        this.onToggleBlockType = this.onToggleBlockType.bind(this);
        this.onToggleInlineStyle = this.onToggleInlineStyle.bind(this);
    }

    onChange(editorState){
        this.setState({
            editorState: editorState
        })
    }

    onToggleBlockType(blockType){
        this.onChange(RichUtils.toggleBlockType(this.state.editorState, blockType));
    }

    onToggleInlineStyle(inlineStyle){
        this.onChange(RichUtils.toggleInlineStyle(this.state.editorState, inlineStyle));
    }

    render(){
        const { editorState } = this.state;
        return(
            <div>
            <EditorControls
            editorState={editorState}
            onToggleBlockTyoe={this.onToggleBlockType}
            onToggleInline={this.onToggleInlineStyle}
            />
            <Editor
            editorState={editorState}
            placeholder="Enter some text here."
            ref="editor"
            spellCheck={true}
            onChange={this.onChange}
            />
            </div>
        )
    }
}
export default CustomDraft;

class EditorButton extends React.Component {
    constructor(){
        super();

        this.onToggle = this.onToggle.bind(this);
    }

    onToggle(e){
        e.preventDefault();
        this.props.onToggle(this.props.style);
    }

    render(){
        let className = 'editorButton';
        if(this.props.active){
            className += ' editorButtonActive';
        }
        return(
            <span className={className} onMouseDown={this.onToggle}>
            {this.props.label}
            </span>
        )
    }
}


const EditorControls = (props) => {
    const {editorState} = props;
    let currentStyle = props.editorState.getCurrentInlineStyle();
    const selection = editorState.getSelection();
    const blockType = editorState.getCurrentContent().getBlockForKey(selection.getStartKey()).getType();
    return (
        <div className="editorControls">
            <div className="editorControlRow">
                {BLOCK_TYPES.map(
                    (type) => <EditorButton
                    key={type.label}
                    active={type.style === blockType}
                    label={type.label}
                    onToggle={props.onToggleBlockTyoe}
                    style={type.style}
                    />
                )}
            </div>
            <div className="editorControlRow">
            {INLINE_STYLES.map(
                type => <EditorButton
                key={type.label}
                active={currentStyle.has(type.style)}
                label={type.label}
                onToggle={props.onToggleInline}
                style={type.style}
                />
            )}
            </div>
        </div>
    );
};

const BLOCK_TYPES = [
    {
        label: 'H1',
        style: 'header-one'
    }, {
        label: 'H2',
        style: 'header-two'
    }, {
        label: 'H3',
        style: 'header-three'
    }, {
        label: 'H4',
        style: 'header-four'
    }, {
        label: 'H5',
        style: 'header-five'
    }, {
        label: 'H6',
        style: 'header-six'
    }, {
        label: 'Blockquote',
        style: 'blockquote'
    }, {
        label: 'UL',
        style: 'unordered-list-item'
    }, {
        label: 'OL',
        style: 'ordered-list-item'
    }, {
        label: 'Code Block',
        style: 'code-block'
    }
];


const INLINE_STYLES = [
    {
        label: 'Bold',
        style: 'BOLD'
    }, {
        label: 'Italic',
        style: 'ITALIC'
    }, {
        label: 'Underline',
        style: 'UNDERLINE'
    }, {
        label: 'Monospace',
        style: 'CODE'
    }
];
