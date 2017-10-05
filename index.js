import React from 'react'
import { View, TouchableOpacity, Dimensions, Picker, Animated, Easing } from 'react-native'

type MinimalistPickerProps = {
  style: {},
  defaultValue: Number,
  options: Array,
  onSelectionChange: () => {},
  onToggle: () => {},
}

export default class MinimalistPicker extends React.Component {
  constructor (props: MinimalistPickerProps) {
    super(props)
    this.state = {
      selectedValue: this.props.defaultValue || 'Select a Value',
      slide: new Animated.ValueXY({ x: 0, y: 500 }),
    }
  }

  componentDidMount() {
    this.triggerSlideAnimation(500, 0, false)
  }

  triggerSlideAnimation (originalX, finalY, isExiting) {
    this.state.slide.setValue({ x: 0, y: originalX })
    Animated.timing(
      this.state.slide,
      {
        toValue: { x: 0, y: finalY },
        easing: Easing.linear,
        duration: 500
      }
    ).start(() => {
      if (isExiting) {
        this.props.onToggle()
      }
    })
  }

  closePicker() {
    this.triggerSlideAnimation(0, 500, true)
  }

  renderOptions() {
    return this.props.options.map((item, index) => {
      return (<Picker.Item key={index} color={'black'} label={item.label} value={item.value} />)
    })
  }

  changeSelection(item, index) {
    this.setState({ selectedValue: item })
    this.props.onSelectionChange(item)
  }

  slideStyle () {
    const translateValues = this.state.slide.getTranslateTransform()
    return [
      { transform: [translateValues[0], translateValues[1]] }
    ]
  }

  render () {
    return (
      <Animated.View style={[this.slideStyle(), { flex: 1, position: 'absolute', top: 0, right: 0, bottom: 0, left: 0 }]}>
        <TouchableOpacity onPress={() => this.closePicker()} style={{ backgroundColor: 'rgba(0, 0, 0, 0)', flex: 1, position: 'absolute', top: 0, right: 0, bottom: 0, left: 0, zIndex: 2 }} />
        <Picker
          style={[{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            backgroundColor: '#FAFAFA',
            zIndex: 3
          }, this.props.style]}
          selectedValue={this.state.selectedValue}
          onValueChange={(item, index) => this.changeSelection(item, index)}>
          {this.renderOptions()}
        </Picker>
      </Animated.View>
    )
  }
}
