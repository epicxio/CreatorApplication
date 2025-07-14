import React from 'react';
import { Box, Stack, TextField, IconButton, Button, Typography, Checkbox, Radio, FormControlLabel, Switch, Select, MenuItem, InputLabel, FormControl, Paper, Divider } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';

export type QuizOption = {
  id: string;
  text: string;
  isCorrect: boolean;
};

export type QuizQuestion = {
  id: string;
  text: string;
  type: 'single' | 'multiple';
  options: QuizOption[];
  includeNoneOfTheAbove?: boolean;
  includeAllOfTheAbove?: boolean;
};

type Props = {
  value: QuizQuestion;
  onChange: (q: QuizQuestion) => void;
  index?: number;
  total?: number;
};

const QuizQuestionEditor: React.FC<Props> = ({ value, onChange, index, total }) => {
  // Handlers
  const handleQuestionText = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({ ...value, text: e.target.value });
  };
  const handleType = (e: any) => {
    const type = e.target.value as 'single' | 'multiple';
    // If switching to single, ensure only one correct
    let options = value.options;
    if (type === 'single' && options.filter(o => o.isCorrect).length > 1) {
      const firstCorrect = options.findIndex(o => o.isCorrect);
      options = options.map((o, i) => ({ ...o, isCorrect: i === firstCorrect }));
    }
    onChange({ ...value, type, options });
  };
  const handleOptionText = (id: string, text: string) => {
    onChange({ ...value, options: value.options.map(o => o.id === id ? { ...o, text } : o) });
  };
  const handleAddOption = () => {
    onChange({ ...value, options: [...value.options, { id: `opt-${Date.now()}`, text: '', isCorrect: false }] });
  };
  const handleRemoveOption = (id: string) => {
    onChange({ ...value, options: value.options.filter(o => o.id !== id) });
  };
  const handleMarkCorrect = (id: string) => {
    if (value.type === 'single') {
      onChange({ ...value, options: value.options.map(o => ({ ...o, isCorrect: o.id === id })) });
    } else {
      onChange({ ...value, options: value.options.map(o => o.id === id ? { ...o, isCorrect: !o.isCorrect } : o) });
    }
  };
  const handleToggleNone = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({ ...value, includeNoneOfTheAbove: e.target.checked });
  };
  const handleToggleAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({ ...value, includeAllOfTheAbove: e.target.checked });
  };

  // Preview rendering
  const renderPreview = () => (
    <Paper variant="outlined" sx={{ p: 2, mt: 2, background: '#f8fafc' }}>
      <Typography variant="subtitle1" fontWeight={700} mb={1}>Preview</Typography>
      <Typography mb={1}>{value.text || <i>Question text...</i>}</Typography>
      <Stack spacing={1}>
        {value.options.map((o, i) => (
          <FormControlLabel
            key={o.id}
            control={value.type === 'single' ? <Radio disabled /> : <Checkbox disabled />}
            label={o.text || <i>Option {i + 1}</i>}
          />
        ))}
        {value.includeNoneOfTheAbove && (
          <FormControlLabel
            control={value.type === 'single' ? <Radio disabled /> : <Checkbox disabled />}
            label={<i>None of the above</i>}
          />
        )}
        {value.includeAllOfTheAbove && (
          <FormControlLabel
            control={value.type === 'single' ? <Radio disabled /> : <Checkbox disabled />}
            label={<i>All of the above</i>}
          />
        )}
      </Stack>
    </Paper>
  );

  return (
    <Box>
      <Stack spacing={2}>
        <Stack direction="row" spacing={2} alignItems="center">
          <TextField
            label={`Question${typeof index === 'number' && typeof total === 'number' ? ` ${index + 1} of ${total}` : ''}`}
            value={value.text}
            onChange={handleQuestionText}
            fullWidth
          />
          <FormControl size="small" sx={{ minWidth: 160 }}>
            <InputLabel>Type</InputLabel>
            <Select value={value.type} label="Type" onChange={handleType}>
              <MenuItem value="single">Single Choice</MenuItem>
              <MenuItem value="multiple">Multiple Choice</MenuItem>
            </Select>
          </FormControl>
        </Stack>
        <Divider />
        <Typography variant="subtitle2" fontWeight={600}>Options</Typography>
        <Stack spacing={1}>
          {value.options.map((o, i) => (
            <Stack direction="row" spacing={1} alignItems="center" key={o.id}>
              {value.type === 'single' ? (
                <Radio
                  checked={o.isCorrect}
                  onChange={() => handleMarkCorrect(o.id)}
                  color="primary"
                />
              ) : (
                <Checkbox
                  checked={o.isCorrect}
                  onChange={() => handleMarkCorrect(o.id)}
                  color="primary"
                />
              )}
              <TextField
                value={o.text}
                onChange={e => handleOptionText(o.id, e.target.value)}
                placeholder={`Option ${i + 1}`}
                size="small"
                sx={{ flex: 1 }}
              />
              <IconButton onClick={() => handleRemoveOption(o.id)} disabled={value.options.length <= 2}>
                <DeleteIcon />
              </IconButton>
            </Stack>
          ))}
          <Button startIcon={<AddCircleOutlineIcon />} onClick={handleAddOption} size="small" sx={{ alignSelf: 'flex-start' }}>
            Add Option
          </Button>
        </Stack>
        {/* None/All of the above toggles */}
        {value.type === 'multiple' && (
          <Stack direction="row" spacing={2} alignItems="center">
            <FormControlLabel
              control={<Switch checked={!!value.includeNoneOfTheAbove} onChange={handleToggleNone} />}
              label="None of the above"
            />
            <FormControlLabel
              control={<Switch checked={!!value.includeAllOfTheAbove} onChange={handleToggleAll} />}
              label="All of the above"
            />
          </Stack>
        )}
        <Box sx={{ background: '#f0f4ff', borderRadius: 2, p: 2, mb: 2 }}>
          <Typography variant="body2" color="primary">
            <b>Instructions:</b> For <b>Single Choice</b>, select one correct answer using the radio button. For <b>Multiple Choice</b>, select all correct answers using the checkboxes. These selections will be used to automatically grade the quiz for learners.
          </Typography>
        </Box>
        {renderPreview()}
      </Stack>
    </Box>
  );
};

export default QuizQuestionEditor; 