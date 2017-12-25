'use strict';

// Developer of this component is dirty programmer! I haven't any time to clear it...

import React, {Component, PropTypes} from 'react';
import {View, Text, TouchableHighlight, Image, TouchableOpacity, ScrollView, Animated, Easing} from 'react-native';

class DropdownMenu extends Component {

    constructor(props, context) {
        super(props, context);

        var selectIndex = new Array(this.props.data.length);
        for (var i = 0; i < selectIndex.length; i++) {
            selectIndex[i] = this.props.selectIndex;
        }
        this.state = {
            activityIndex: this.props.activityIndex,
            selectIndex: selectIndex,
            rotationAnims: props.data.map(() => new Animated.Value(0))
        };

        this.defaultConfig = {
            bgColor: 'grey',
            tintColor: 'white',
            selectItemColor: "red",
            arrowImg: './img/dropdown_arrow.png',
            checkImage: './img/menu_check.png'
        };

    }

    renderChcek(index, title) {
        var activityIndex = this.state.activityIndex;
        if (this.state.selectIndex[activityIndex] == index) {
            var checkImage = this.props.checkImage ? this.props.checkImage : require('./img/menu_check.png');
            return (
                <View style={[{flex: 1, justifyContent: 'space-between', alignItems: "center", paddingHorizontal: 15, flexDirection: 'row'}, this.props.selectedWrapperStyle]} >
                    <Text style={[{color: this.props.selectItemColor ? this.props.selectItemColor : this.defaultConfig.selectItemColor}, this.props.selectedItemStyle]} >{title}</Text>
                    <Image source={checkImage} style={this.props.itemImageStyle}/>
                </View>
            );
        } else {
            return (
                <View style={[{flex: 1, justifyContent: 'space-between', alignItems: "center", paddingHorizontal: 15, flexDirection: 'row'}, this.props.selectWrapperStyle]} >
                    <Text style={[{color: 'black'}, this.props.selectItemStyle]} >{title}</Text>
                </View>
            );
        }
    }

    renderActivityPanel() {
        if (this.state.activityIndex >= 0) {

            var currentTitles = this.props.data[this.state.activityIndex];

            var heightStyle = {};
            if (this.props.maxHeight && this.props.maxHeight < currentTitles.length * this.props.itemHeight) {
                heightStyle.height = this.props.maxHeight;
            }

            return (
                <View style={{position: 'absolute', left: 0, right: 0, top: 35, bottom: 0, zIndex: 0}}>
                    <TouchableOpacity onPress={() => this.openOrClosePanel(this.state.activityIndex)} activeOpacity={1} style={{position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, zIndex: 0}}>
                        <View style={{opacity: 0.4, backgroundColor: 'black', flex: 1 }} />
                    </TouchableOpacity>

                    <ScrollView style={[{position: 'absolute', top: 0, left: 0, right: 0, zIndex: 0, backgroundColor: 'white'}, heightStyle]} >
                        {
                            currentTitles.map((title, index) =>
                                <TouchableOpacity key={index} activeOpacity={1} style={{flex: 1, height: this.props.itemHeight}} onPress={this.itemOnPress.bind(this, index)} >
                                    {this.renderChcek(index, title)}
                                    <View style={[{backgroundColor: '#F6F6F6', height: 1, marginLeft: 15}, this.props.borderBottomStyle]} />
                                </TouchableOpacity>
                            )
                        }
                    </ScrollView>
                </View>
            );
        } else {
            return (null);
        }
    }

    openOrClosePanel(index) {

        this.props.bannerAction ? this.props.bannerAction() : null;

        if (this.state.activityIndex == index) {
            this.closePanel(index);
            this.setState({
                activityIndex: -1,
            });
            // toValue = 0;
        } else {
            // this.closeMenu(index);
            if (this.state.activityIndex > -1) {
                this.closePanel(this.state.activityIndex);
            }
            this.openPanel(index);
            this.setState({
                activityIndex: index,
            });
        }
    }

    openPanel(index) {
        Animated.timing(
            this.state.rotationAnims[index],
            {
                toValue: 0.5,
                duration: 300,
                easing: Easing.linear
            }
        ).start();
    }

    closePanel(index) {
        Animated.timing(
            this.state.rotationAnims[index],
            {
                toValue: 0,
                duration: 300,
                easing: Easing.linear
            }
        ).start();
    }

    // closeMenu = (index) => {
    //     const { bannerAction } = this.props;
    //
    //     bannerAction ? bannerAction() : null;
    //     this.closePanel(index);
    //     this.setState({ activityIndex: -1 });
    // };

    itemOnPress(index) {
        if (this.state.activityIndex > -1) {
            var selectIndex = this.state.selectIndex;
            selectIndex[this.state.activityIndex] = index;
            this.setState({
                selectIndex: selectIndex
            });
            if (this.props.handler) {
                this.props.handler(this.state.activityIndex, index);
            }
        }
        this.openOrClosePanel(this.state.activityIndex);
    }

    renderDropDownArrow(index) {
        var icon = this.props.arrowImg ? this.props.arrowImg : require('./img/icon-dropdown-arrow-down.png');

        return (
            <Animated.Image
                source={icon}
                style={[{marginLeft: 8, transform: [{
                    rotateZ: this.state.rotationAnims[index].interpolate({
                        inputRange: [0, 1],
                        outputRange: ['0deg', '360deg']
                    })
                }]}, this.props.arrowImageStyle]} />
        );
    }

    render() {

        return (
            <View style={{flexDirection: 'column', flex: 1}} >
                <View style={{flexDirection: 'row', backgroundColor: this.props.bgColor ? this.props.bgColor : this.defaultConfig.bgColor}} >

                    {
                        this.props.data.map((rows, index) =>
                            <TouchableOpacity
                                activeOpacity={1}
                                onPress={this.openOrClosePanel.bind(this, index)}
                                key={index}
                                style={[{flex: 1, height: 40, alignItems: "center", justifyContent: "center"}, this.props.headerItemStyle]} >
                                <View style={{flexDirection: 'row', alignItems: "center", justifyContent: "center"}} >
                                    <Text style={[{color: this.props.tintColor ? this.props.tintColor : this.defaultConfig.tintColor, fontSize: 13}, this.props.headerTextStyle]} >{rows[this.state.selectIndex[index]]}</Text>
                                    {this.renderDropDownArrow(index)}
                                </View>
                            </TouchableOpacity>
                        )
                    }
                </View>
                {this.props.children}

                {this.renderActivityPanel()}

            </View>
        );
    }

}


DropdownMenu.propTypes = {
    bgColor: PropTypes.string,
    tintColor: PropTypes.string,
    selectItemColor: PropTypes.string,
    arrowImg: PropTypes.number,
    checkImage: PropTypes.number,
    data: PropTypes.array,
    bannerAction: PropTypes.func,

};

export default DropdownMenu;
