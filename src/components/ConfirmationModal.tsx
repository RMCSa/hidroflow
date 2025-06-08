import React from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText, 
  DialogTitle,
  Box, 
  CircularProgress, 
} from "@mui/material";
import { SxProps, Theme } from '@mui/material/styles';

interface ConfirmationModalProps {
  open: boolean;
  title: string;
  message: React.ReactNode; 
  actionLabel: string; 
  cancelActionLabel?: string;
  onAction: () => Promise<void> | void; 
  onClose: () => void;
  icon?: React.ReactNode;
  actionButtonColor?: "inherit" | "primary" | "secondary" | "success" | "error" | "info" | "warning";
  isLoading?: boolean; 
  sx?: SxProps<Theme>; 
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  open,
  title,
  message,
  actionLabel,
  cancelActionLabel,
  onAction,
  onClose,
  icon,
  actionButtonColor = "primary", 
  isLoading = false,
  sx,
}) => {
  const handleAction = async () => {
    await onAction();
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      sx={sx} 
      PaperProps={{component: 'div'}} 
      aria-labelledby="confirmation-dialog-title"
      aria-describedby="confirmation-dialog-description"
      maxWidth="xs"
    
    >
      <DialogTitle id="confirmation-dialog-title" sx={{ textAlign: icon ? 'center' : 'left', fontWeight: 'bold' }}>
        {icon && (
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            mb: 1, 
            color: actionButtonColor === 'error' ? 'error.main' : 'primary.main',
            fontSize: 40 // Aplicando fontSize ao Box
          }}>
            {icon} {/* Renderizando o ícone diretamente */}
          </Box>
        )}
        {title}
      </DialogTitle>
      <DialogContent sx={{ textAlign: icon ? 'center' : 'inherit' }}>
        {typeof message === 'string' ? (
          <DialogContentText id="confirmation-dialog-description">
            {message}
          </DialogContentText>
        ) : (
          message 
        )}
      </DialogContent>
      <DialogActions sx={{ p: {xs: 2, sm: '16px 24px'} }}> 
        <Button onClick={onClose} variant="outlined" color="inherit">
          {cancelActionLabel || "Cancelar"}
        </Button>
        <Button 
          onClick={handleAction} 
          variant="contained" 
          color={actionButtonColor} 
          disabled={isLoading}
          startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : null}
        >
          {actionLabel}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmationModal;
