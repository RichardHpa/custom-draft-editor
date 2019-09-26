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
            editorID: props.editorID
        };

        this.plugins = [
            addLinkPlugin,
        ];

        this.onChange = this.onChange.bind(this);
        this.onToggleBlockType = this.onToggleBlockType.bind(this);
        this.onToggleInlineStyle = this.onToggleInlineStyle.bind(this);

        this.onOpenLink = this.onOpenLink.bind(this);
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

    onAddLink = (here) => {
        const element = document.getElementById(`editorContainer-${this.state.editorID}`);
        const editor = element.getElementsByClassName( 'DraftEditor-root' )[0]
        console.log(element);
        console.log(editor);
        var newDiv = document.createElement("div");
        var newContent = document.createTextNode("Hi there and greetings!");
        newDiv.appendChild(newContent);
        element.appendChild(newDiv);


        const editorState = this.state.editorState;
        const selection = editorState.getSelection();
        const link = window.prompt("Paste the link -");
        if (!link) {
            this.onChange(RichUtils.toggleLink(editorState, selection, null));
            return "handled";
        }
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
        return "handled";
    };

    onOpenLink(){

    }

    render(){
        const { editorState, editorID } = this.state;
        return(
            <div id={`editorContainer-${editorID}`} className="editorContainer">
                <EditorControls
                    editorState={editorState}
                    onToggleBlockTyoe={this.onToggleBlockType}
                    onToggleInline={this.onToggleInlineStyle}
                    // AddLink={this.onAddLink}
                    AddLink={this.onOpenLink}
                />
                <LinkEditor/>
                <Editor
                    editorState={editorState}
                    placeholder="Enter some text here."
                    ref="editor"
                    spellCheck={true}
                    plugins={this.plugins}
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
        };
    }

    render(){
        return(
            <div className="anchorContainer">
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam egestas metus id elit scelerisque, eget rutrum urna convallis. In et accumsan metus. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus tempus ipsum quis dui scelerisque consectetur. Donec non ipsum ante. Phasellus id euismod libero. Ut quam tellus, consectetur id condimentum vel, pharetra quis quam. In hac habitasse platea dictumst.

</p>
            </div>
        )
    }
}
