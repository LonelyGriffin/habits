import React, {useCallback, useState} from 'react'
import moment, {Moment} from 'moment'
import {PageHeader, DatePicker, Input, Divider, Button} from 'antd'
import {EditOutlined, SaveOutlined} from '@ant-design/icons'
import * as styles from './Diary.module.less'

const {TextArea} = Input

export function DiaryScreenView() {
  const diaryNote = 'f'
  const [selectedDate, setSelectedDate] = useState<Moment>(moment())
  const [currentDiaryNote, setCurrentDiaryNote] = useState(diaryNote)
  const [isEditMode, setIsEditMode] = useState(false)
  const disabledFeatureDate = useCallback((current: Moment) => current && current > moment().endOf('day'), [])

  const handleDatePickerChange = useCallback((date: Moment | null) => {
    if (date !== null) {
      setIsEditMode(false)
      setSelectedDate(date)
    }
  }, [])

  const handleSave = useCallback(() => {
    setIsEditMode(false)
  }, [])

  const editingAvailable = selectedDate.day() === moment().day()

  return (
    <div className={styles.root}>
      <PageHeader className={styles.header} title={'Дневник'} />
      <div className={styles.body}>
        <DatePicker
          className={styles.calendar}
          size={'large'}
          disabledDate={disabledFeatureDate}
          defaultValue={selectedDate}
          onChange={handleDatePickerChange}
        />
        <Divider orientation={'left'}>Ваша заметка</Divider>
        <div className={styles.editableNote}>
          {editingAvailable && isEditMode ? (
            <>
              <Button
                className={styles.editableNoteAction}
                shape='circle'
                icon={<SaveOutlined />}
                onClick={handleSave}
              />
              <TextArea
                rows={8}
                defaultValue={diaryNote}
                value={currentDiaryNote}
                onChange={(e) => {
                  setCurrentDiaryNote(e.target.value)
                }}
              />
            </>
          ) : (
            <>
              <Button
                disabled={!editingAvailable}
                className={styles.editableNoteAction}
                shape='circle'
                icon={<EditOutlined />}
                onClick={() => setIsEditMode(true)}
              />
              <span>{currentDiaryNote}</span>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
