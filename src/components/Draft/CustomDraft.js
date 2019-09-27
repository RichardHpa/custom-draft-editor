import React, { Component } from 'react';
import { EditorState, RichUtils } from 'draft-js';
import Editor from "draft-js-plugins-editor";
import './CustomDraft.scss';
import addLinkPlugin from './plugins/addLinkPlugin'

class CustomDraft extends Component {
    constructor(props){
        super(props);
        this.state = {
            editorState: EditorState.createEmpty(),
            editorID: props.editorID,
            anchorInput: false
        };

        this.plugins = [
            addLinkPlugin,
        ];

        this.onChange = this.onChange.bind(this);
        this.onToggleBlockType = this.onToggleBlockType.bind(this);
        this.onToggleInlineStyle = this.onToggleInlineStyle.bind(this);

        this.onOpenLink = this.onOpenLink.bind(this);
        this.onAddLink = this.onAddLink.bind(this);
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


    onOpenLink(){
        const { anchorInput } = this.state;
        const editorState = this.state.editorState;
        const selection = editorState.getSelection();

        this.setState({
            selection: selection,
            anchorInput: !anchorInput
        })
    }

    onAddLink(link){
        const { selection } = this.state;
        if(link.length > 0){
            const editorState = this.state.editorState;

            const content = editorState.getCurrentContent();
            const contentWithEntity = content.createEntity("LINK", "MUTABLE", {
                url: link
            });
            const newEditorState = EditorState.push(
                editorState,
                contentWithEntity,
                "create-entity"
            );
            const entityKey = contentWithEntity.getLastCreatedEntityKey();
            this.onChange(RichUtils.toggleLink(newEditorState, selection, entityKey));
            this.setState({
                anchorInput: false,
                selection: null,
            })
            return "handled";
        }

    }

    render(){
        const { editorState, editorID , anchorInput} = this.state;
        return(
            <div id={`editorContainer-${editorID}`} className="editorContainer">
                <EditorControls
                    editorState={editorState}
                    onToggleBlockTyoe={this.onToggleBlockType}
                    onToggleInline={this.onToggleInlineStyle}
                    AddLink={this.onOpenLink}
                />
                {
                    anchorInput? <LinkEditor
                    addAnchor={this.onAddLink}
                    />: ''
                }
                <Editor
                    editorState={editorState}
                    placeholder="Enter some text here."
                    ref="editor"
                    spellCheck={true}
                    plugins={this.plugins}
                    onChange={this.onChange}
                    readOnly={anchorInput}
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

const MEDIA_BUTTONS = [
    {
        label: 'Anchor',
        style: 'ANCHOR'
    }
];

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
            <div className="editorControlRow">
            {MEDIA_BUTTONS.map(
                type => <EditorButton
                key={type.label}
                label={type.label}
                onToggle={props.AddLink}
                />
            )}
            </div>
        </div>
    );
};


class LinkEditor extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            anchor: ''
        };

        this.onSubmit = this.onSubmit.bind(this);
        this.onChange = this.onChange.bind(this);
    }

    onSubmit(e){
        e.preventDefault();
        this.props.addAnchor(this.state.anchor);
        this.setState({anchor: ''});

    }

    onChange(e){
        this.setState({
            anchor: e.target.value
        })
    }

    render(){
        return(
            <form className="anchorContainer" onSubmit={this.onSubmit}>
                <input className="anchorInput" type="text" placeholder="please enter url" onChange={this.onChange} value={this.state.anchor}/>
                <div className="anchorButtonAppend">
                    <button type="submit">Add Link</button>
                </div>
            </form>

        )
    }
}
