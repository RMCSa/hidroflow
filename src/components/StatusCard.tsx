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
        borderRadius: theme.shape.borderRadius, 
        boxShadow: theme.shadows[2], 
        ...sx, 
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
        <Box
          sx={{
            mr: 1.5,
            color: iconColor || borderColor || "primary.main",
            fontSize: isMobile ? theme.typography.pxToRem(28) : theme.typography.pxToRem(32), 
            display: 'flex', 
            alignItems: 'center' 
          }}
        >
          {icon} {/* Ícone renderizado diretamente */}
        </Box>
        <Typography variant={isMobile ? "subtitle1" : "h6"} color="text.secondary" sx={{ fontWeight: isMobile ? 500 : 'normal' }}>
          {title}
        </Typography>
      </Box>
      <Typography
        variant={isMobile ? "h5" : "h4"}
        component="p"
        sx={{
          pl: isMobile ? 0 : `calc(${theme.typography.pxToRem(32)} + ${theme.spacing(1.5)})`, 
          fontWeight: "bold",
          textAlign: isMobile ? "center" : "left", 
          mt: isMobile ? 1 : 0.5, 
          lineHeight: 1.2, 
        }}
      >
        {value}
      </Typography>
      {subText && (
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            pl: isMobile ? 0 : `calc(${theme.typography.pxToRem(32)} + ${theme.spacing(1.5)})`, 
            mt: 0.5,
            textAlign: isMobile ? "center" : "left", 
          }}
        >
          {subText}
        </Typography>
      )}
      {children && <Box sx={{mt: 1}}>{children}</Box>}
    </Paper>
  );
};

export default StatusCard;
