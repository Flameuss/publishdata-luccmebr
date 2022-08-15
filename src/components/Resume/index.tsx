import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog, { DialogProps } from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { createStyles, makeStyles, Theme } from '@material-ui/core';

import { useTranslation } from 'react-i18next';

import Logo from '../../assets/img/restore-logo.png';
import BMULogo from '../../assets/img/bmu-logo.png';

type ResumeProps = {
  open: boolean;
  onClose: () => void;
};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    buttonDefault: {
      backgroundColor: '#24806F',
      color: '#ffffff',
      '&:hover': {
        backgroundColor: '#24806F',
      },
    },
    imgContent: {
      display: 'flex',
      alignItems: 'center',
      flexDirection: 'row',
      margin: '12px 16px 8px 16px',
      [theme.breakpoints.down('xs')]: {
        flexDirection: 'column',
        marginBottom: 16,
      },
    },
    imgBMULogo: {
      height: 120,
      marginBottom: 0,
      [theme.breakpoints.down('xs')]: {
        marginBottom: 16,
      },
    },
    imgLogo: {
      marginLeft: 24,
      [theme.breakpoints.down('xs')]: {
        marginLeft: 0,
        marginTop: 8,
      },
      height: 30,
    },
    contentDialogTitile: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      [theme.breakpoints.down('xs')]: {
        justifyContent: 'center',
        fontSize: '16px',
        flexWrap: 'wrap',
        textAlign: 'center',
      },
    },
    dialogInfo: {
      [theme.breakpoints.up('xl')]: {
        fontSize: '14px',
      },
    },
  }),
);

function Resume({ open, onClose }: ResumeProps) {
  const classes = useStyles();
  const [scroll] = React.useState<DialogProps['scroll']>('paper');

  const { t } = useTranslation();

  const descriptionElementRef = React.useRef<HTMLElement>(null);
  React.useEffect(() => {
    if (open) {
      const { current: descriptionElement } = descriptionElementRef;
      if (descriptionElement !== null) {
        descriptionElement.focus();
      }
    }
  }, [open]);

  return (
    <div>
      <Dialog
        fullWidth={true}
        maxWidth={'md'}
        open={open}
        onClose={onClose}
        scroll={scroll}
        aria-labelledby="scroll-dialog-title"
        aria-describedby="scroll-dialog-description"
      >
        <DialogTitle id="scroll-dialog-title">
          <div className={classes.contentDialogTitile}>
            {t('Subtitle')}
            <img src={Logo} className={classes.imgLogo} alt="Restore+ logo" />
          </div>
        </DialogTitle>

        <DialogContent dividers={scroll === 'paper'}>
          <DialogContentText
            id="scroll-dialog-description"
            ref={descriptionElementRef}
            tabIndex={-1}
            align={'justify'}
            style={{ marginBottom: '0' }}
            className={classes.dialogInfo}
          >
            {t('Resume.part01')}{' '}
            <strong>
              <a
                href="https://luccmebr-tiles.publishdata.com.br/public/download/New_land_change_scenarios_for_Brazil__refining_the_global_SSPs_with_regional_spatially_explicit_allocation_models.pdf"
                target="_blank"
                rel="noopener noreferrer"
              >
                {' '}
                {t('Resume.part02')}
              </a>
            </strong>
            {t('Resume.part03')}
          </DialogContentText>

          <div className={classes.imgContent}>
            <img
              src={BMULogo}
              className={classes.imgBMULogo}
              alt="Restore+ logo"
            />
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} className={classes.buttonDefault}>
            {t('ReportAllBiomes.buttonClose')}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default React.memo(Resume);
