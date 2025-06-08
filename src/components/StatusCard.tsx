// src/components/StatusCard.tsx
import React from "react";
import { Paper, Typography, Box, useTheme, useMediaQuery } from "@mui/material";
import { SxProps, Theme } from "@mui/material/styles";

interface StatusCardProps {
  icon: React.ReactElement;
  title: string;
  value: string | number;
  subText?: string;
  borderColor?: string;
  iconColor?: string;
  children?: React.ReactNode;
  sx?: SxProps<Theme>;
}

const StatusCard: React.FC<StatusCardProps> = ({
  icon,
  title,
  value,
  subText,
  borderColor,
  iconColor,
  children,
  sx,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Paper
      elevation={2}
      sx={{
        p: 2,
        display: "flex",
        flexDirection: "column",
        height: "100%",
        borderLeft: 5,
        borderColor: borderColor || "primary.main",
        ...sx,
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
        <Box
          sx={{
            mr: 1.5,
            color: iconColor || borderColor || "primary.main",
            fontSize: isMobile ? theme.typography.pxToRem(24) : theme.typography.pxToRem(32), // Ajuste o tamanho conforme necessário
            display: 'flex', // Para alinhar o ícone caso ele tenha dimensões intrínsecas
            alignItems: 'center' // Para alinhar o ícone caso ele tenha dimensões intrínsecas
          }}
        >
          {icon}
        </Box>
        <Typography variant={isMobile ? "subtitle1" : "h6"} color="text.secondary" sx={{ fontWeight: isMobile ? 500 : 'normal' }}>
          {title}
        </Typography>
      </Box>
      <Typography
        variant={isMobile ? "h5" : "h4"}
        component="p"
        sx={{
          pl: isMobile ? 0 : "44px", // Ajuste do padding-left para mobile
          fontWeight: "bold",
          textAlign: isMobile ? "center" : "left", // Centraliza em mobile
          mt: isMobile ? 1 : 0,
        }}
      >
        {value}
      </Typography>
      {subText && (
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            pl: isMobile ? 0 : "44px", // Ajuste do padding-left para mobile
            mt: 0.5,
            textAlign: isMobile ? "center" : "left", // Centraliza em mobile
          }}
        >
          {subText}
        </Typography>
      )}
      {children}
    </Paper>
  );
};

export default StatusCard;
