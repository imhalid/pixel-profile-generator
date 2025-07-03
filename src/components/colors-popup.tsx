import * as Popover from '@radix-ui/react-popover'
import { animated, useTransition } from '@react-spring/web'
import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  setLinearFirstColor,
  setLinearSecondColor,
  setLinearFirstColorOpacity,
  setLinearSecondColorOpacity,
  setRadialFirstColor,
  setRadialSecondColor,
  setRadialFirstColorOpacity,
  setRadialSecondColorOpacity,
  setTextColor,
  setTextColorOpacity,
  PreviewState
} from '../store/slices/preview-slice'
import './styles.css'
import { RootState } from '../store/store'
import { Dispatch } from '@reduxjs/toolkit'

// Define hex opacity values
const hexOpacity: { [key: number]: string } = {
  0: '00',
  10: '1A',
  20: '33',
  30: '4D',
  40: '66',
  50: '80',
  60: '99',
  70: 'B3',
  80: 'CC',
  90: 'E6',
  100: 'FF'
}

// Define color options
const colors: string[] = [
  '#000000',
  '#FFFFFF',
  '#FF0000',
  '#00FF00',
  '#0000FF',
  '#FFFF00',
  '#FF00FF',
  '#00FFFF'
]

const Popovers = () => {
  return (
    <div className='flex items-center flex-wrap lg:flex-nowrap justify-between gap-2'>
      {/* <PopoverDemo type='linearFirstColor' />
      <PopoverDemo type='linearSecondColor' />
      <PopoverDemo type='radialFirstColor' />
      <PopoverDemo type='radialSecondColor' /> */}
      <PopoverDemo type='textColor' />
    </div>
  )
}

export default Popovers

const PopoverDemo = ({ type }: { type: string }) => {
  const dispatch = useDispatch()
  const preview = useSelector((state: RootState) => state.preview)
  const setting = useSelector((state: RootState) => state.setting)
  const customThemeIsAvailable = setting.themeName !== '--'
  
  useEffect(() => {
    document.body.setAttribute(
      'style',
      `--linearFirstColor: ${preview.linearFirstColor}${preview.linearFirstColorOpacity}; --linearSecondColor: ${preview.linearSecondColor}${preview.linearSecondColorOpacity}; --radialFirstColor: ${preview.radialFirstColor}${preview.radialFirstColorOpacity}; --radialSecondColor: ${preview.radialSecondColor}${preview.radialSecondColorOpacity}; --textColor: ${preview.textColor}${preview.textColorOpacity}`
    )
  }, [preview.linearFirstColor, preview.linearFirstColorOpacity, preview.linearSecondColor, preview.linearSecondColorOpacity, preview.radialFirstColor, preview.radialFirstColorOpacity, preview.radialSecondColor, preview.radialSecondColorOpacity, preview.textColor, preview.textColorOpacity])

  const [open, setOpen] = useState(false)

  const transitions = useTransition(open, {
    from: {
      opacity: 0,
      transform: 'translateY(-10px)'
    },
    enter: {
      opacity: 1,
      transform: 'translateY(0px)'
    },
    leave: {
      opacity: 0,
      transform: 'translateY(-10px)'
    },
    exitBeforeEnter: true,
    config: {
      duration: 100
    }
  })
  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger asChild>
        <button
          className={`flex w-fit group relative items-center h-full gap-2 bg-neutral-900 px-2 py-1 ${
            customThemeIsAvailable && type !== 'textColor'
              ? 'opacity-30 pointer-events-none'
              : ''
          }`}
          aria-label='Update dimensions'
        >
          <div
            style={{
              backgroundColor: preview[type as keyof PreviewState] as string
            }}
            id='popupButton'
            className='relative h-5 w-5'
          />
          <div
            style={{
              color: preview[type as keyof PreviewState] as string
            }}
            className='control-information absolute transform -translate-x-1/2 top-0 overflow-hidden justify-center flex items-center h-full w-full bg-black px-2 left-1/2 text-white/50 pointer-events-none'
          >
            <span>{type}</span>
          </div>
          <p className='text-xs'>{preview[type as keyof PreviewState]}</p>
        </button>
      </Popover.Trigger>
      {transitions((styles, item) =>
        item ? (
          <Popover.Portal forceMount>
            <animated.div style={styles}>
              <Popover.Content
                className='PopoverContent z-50 relative flex w-52 flex-col items-center justify-center border-2 border-white/50 bg-neutral-950 p-4'
                forceMount
              >
                <ColorPalette
                  dispatch={dispatch}
                  type={type}
                  preview={preview}
                />
              </Popover.Content>
            </animated.div>
          </Popover.Portal>
        ) : null
      )}
    </Popover.Root>
  )
}

const ColorPalette = ({
  dispatch,
  type,
  preview
}: {
  dispatch: Dispatch
  type: string
  preview: PreviewState
}) => {
  let opacityActionType: string = ''
  if (type === 'linearFirstColor') {
    opacityActionType = setLinearFirstColorOpacity.type
  } else if (type === 'linearSecondColor') {
    opacityActionType = setLinearSecondColorOpacity.type
  } else if (type === 'radialFirstColor') {
    opacityActionType = setRadialFirstColorOpacity.type
  } else if (type === 'radialSecondColor') {
    opacityActionType = setRadialSecondColorOpacity.type
  } else if (type === 'textColor') {
    opacityActionType = setTextColorOpacity.type
  }

  let colorActionType: string = ''
  if (type === 'linearFirstColor') {
    colorActionType = setLinearFirstColor.type
  } else if (type === 'linearSecondColor') {
    colorActionType = setLinearSecondColor.type
  } else if (type === 'radialFirstColor') {
    colorActionType = setRadialFirstColor.type
  } else if (type === 'radialSecondColor') {
    colorActionType = setRadialSecondColor.type
  } else if (type === 'textColor') {
    colorActionType = setTextColor.type
  }

  let colorOpacity: string = ''
  if (type === 'linearFirstColor') {
    colorOpacity = preview.linearFirstColorOpacity
  } else if (type === 'linearSecondColor') {
    colorOpacity = preview.linearSecondColorOpacity
  } else if (type === 'radialFirstColor') {
    colorOpacity = preview.radialFirstColorOpacity
  } else if (type === 'radialSecondColor') {
    colorOpacity = preview.radialSecondColorOpacity
  } else if (type === 'textColor') {
    colorOpacity = preview.textColorOpacity
  }

  const returnHexOpacity = (value: number) => {
    const hex = hexOpacity[value]
    dispatch({
      type: opacityActionType,
      payload: hex
    })
  }

  const handleColorChange = (color: string) => {
    dispatch({
      type: colorActionType,
      payload: color
    })
  }

  return (
    <div id='customcolor'>
      {colors.map(color => (
        <button
          key={color}
          style={{ backgroundColor: color }}
          className='color-button'
          onClick={() => {
            handleColorChange(color)
          }}
        />
      ))}
      <div className='w-full mt-3 border-t border-white/50 relative'>
        <input
          type='range'
          min='0'
          max='99'
          value={Object.values(hexOpacity).indexOf(colorOpacity)}
          step={1}
          onChange={e => {
            returnHexOpacity(parseInt(e.target.value))
          }}
          id={type}
        />
        <div className='control-information absolute transform -translate-x-1/2  top-2.5 bg-black px-2 left-1/2 text-white text-xs pointer-events-none text-nowrap group-hover:opacity-0'>
          <span>opacity</span>
        </div>
      </div>
    </div>
  )
}
