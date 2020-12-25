import React, {useCallback, useEffect, useState} from 'react'
import moment, {Moment} from 'moment'
import {PageHeader, DatePicker, Input, Divider, Button} from 'antd'
import {EditOutlined, SaveOutlined} from '@ant-design/icons'
import * as styles from './Diary.module.less'
import {DiaryNote} from '../../../common/entity/diaryNote'
import shortid from 'shortid'
import {useService} from '../../../common/dependencyInjection/hooks'
import {DiaryNoteRepository} from '../../../common/repository/diaryNote/diaryNoteRepository'
import {RootDIType} from '../../../common/dependencyInjection/rootType'

const {TextArea} = Input

export function DiaryScreenView() {
  const diaryNote: DiaryNote | undefined = undefined
  const [currentDiaryNote, setCurrentDiaryNote] = useState<DiaryNote | undefined>(diaryNote)
  const [isEditMode, setIsEditMode] = useState(false)

  const diaryNoteRepository = useService<DiaryNoteRepository>(RootDIType.DiaryNoteRepository)
  const disabledFeatureDate = useCallback((current: Moment) => current && current > moment().endOf('day'), [])

  const loadDiaryNotionByDate = async (date: Moment) => {
    diaryNoteRepository.getByDate(date.endOf('day')).then((result) => {
      if (result.unwrap().isSame) {
        setCurrentDiaryNote(result.unwrap().unwrap())
      } else {
        setCurrentDiaryNote({
          id: shortid(),
          date: date,
          text: ''
        })
      }
    })
  }

  const handleDatePickerChange = useCallback((date: Moment | null) => {
    if (date !== null) {
      setIsEditMode(false)
      void loadDiaryNotionByDate(date)
    }
  }, [])

  const handleSave = useCallback(() => {
    setIsEditMode(false)
    if (currentDiaryNote) {
      void diaryNoteRepository.set(currentDiaryNote)
    }
  }, [currentDiaryNote])

  const editingAvailable = currentDiaryNote ? currentDiaryNote.date.diff(moment().endOf('day')) === 0 : true

  useEffect(() => {
    void loadDiaryNotionByDate(moment())
  }, [])

  const handleTextChange = useCallback((text: string) => {
    setCurrentDiaryNote((state) =>
      state
        ? {
            ...state,
            text
          }
        : undefined
    )
  }, [])

  return (
    <div className={styles.root}>
      <PageHeader className={styles.header} title={'Дневник'} />
      <div className={styles.body}>
        <DatePicker
          className={styles.calendar}
          size={'large'}
          disabledDate={disabledFeatureDate}
          value={currentDiaryNote ? currentDiaryNote.date : undefined}
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
                value={currentDiaryNote ? currentDiaryNote.text : ''}
                onChange={(e) => {
                  handleTextChange(e.target.value)
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
              <span>{currentDiaryNote ? currentDiaryNote.text : ''}</span>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
