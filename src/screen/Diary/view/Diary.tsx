import React, {useCallback, useEffect, useState} from 'react'
import moment, {Moment} from 'moment'
import * as styles from './Diary.module.less'
import {DiaryNote} from '../../../common/entity/diaryNote'
import shortid from 'shortid'
import {useService} from '../../../common/dependencyInjection/hooks'
import {DiaryNoteRepository} from '../../../common/repository/diaryNote/diaryNoteRepository'
import {RootDIType} from '../../../common/dependencyInjection/rootType'
import IconButton from '@material-ui/core/IconButton'
import Typography from '@material-ui/core/Typography'
import {DatePicker} from '@material-ui/pickers'
import {Button, TextField} from '@material-ui/core'
import SaveIcon from '@material-ui/icons/Save'
import EditIcon from '@material-ui/icons/Edit'
import Box from '@material-ui/core/Box'
import {useRouter} from '../../../common/service/router/hooks'
import {Page} from '../../../common/view/page'
import marked from 'marked'
import DOMPurify from 'dompurify'

export function DiaryScreenView() {
  const diaryNote: DiaryNote | undefined = undefined
  const [currentDiaryNote, setCurrentDiaryNote] = useState<DiaryNote | undefined>(diaryNote)
  const [isEditMode, setIsEditMode] = useState(false)

  const diaryNoteRepository = useService<DiaryNoteRepository>(RootDIType.DiaryNoteRepository)
  const disabledFeatureDate = useCallback((current: Moment) => current && current > moment().endOf('day'), [])

  const [all, setAll] = useState([] as any[])
  const handleSaveAll = useCallback(async () => {
    const result = await diaryNoteRepository.getAll()
    console.log(result)
    setAll(result.unwrap())
  }, [])

  const router = useRouter()

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

  const editingAvailable = currentDiaryNote ? currentDiaryNote.date.diff(moment().endOf('day')) === 0 : false

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
    <Page>
      <Typography variant='h5'>Запись</Typography>
      <DatePicker
        className={styles.calendar}
        value={currentDiaryNote ? currentDiaryNote.date : undefined}
        onChange={handleDatePickerChange}
      />
      <br />
      <div className={styles.editableNote}>
        {editingAvailable && isEditMode ? (
          <>
            <Box className={styles.editableNoteAction}>
              <IconButton onClick={handleSave}>
                <SaveIcon />
              </IconButton>
            </Box>
            <TextField
              fullWidth
              rows={8}
              multiline
              variant={'outlined'}
              defaultValue={diaryNote}
              value={currentDiaryNote ? currentDiaryNote.text : ''}
              onChange={(e) => {
                handleTextChange(e.target.value)
              }}
            />
          </>
        ) : (
          <>
            <Box className={styles.editableNoteAction}>
              <IconButton disabled={!editingAvailable} onClick={() => setIsEditMode(true)}>
                <EditIcon />
              </IconButton>
            </Box>
            <span
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(marked(currentDiaryNote ? currentDiaryNote.text : ''), {
                  USE_PROFILES: {html: true}
                })
              }}
            />
          </>
        )}
      </div>
      <div>
        <Button onClick={handleSaveAll}>All</Button>
        {all.map((x) => {
          return (
            <>
              <br />
              <div>{x.date}</div>
              <span
                dangerouslySetInnerHTML={{
                  __html: DOMPurify.sanitize(marked(x ? x.text : ''), {
                    USE_PROFILES: {html: true}
                  })
                }}
              />
            </>
          )
        })}
      </div>
    </Page>
  )
}
