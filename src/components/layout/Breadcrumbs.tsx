import { Stack, Link, Typography, Breadcrumbs as MuiBreadcrumbs } from "@mui/material";
import theme from "@/theme/theme";

import {type BreadcrumbItem } from "@/utils/breadcrumbsItems";


interface BreadcrumbsProps {
    items: BreadcrumbItem[]
}

export const Breadcrumbs = ({ items }: BreadcrumbsProps) => {
    return (
        <Stack width="100%" marginBottom={2}>
            <MuiBreadcrumbs aria-label="breadcrumb" sx={{
                fontSize: "1.2rem",
                fontWeight: "medium",
            }}>
                {items.map((item, key) => (
                    <Link underline="hover" color={key == items.length - 1 ? "text.primary" : "text.secondary"} href={item.link} sx={{ display: 'flex', direction: 'row', gap: 0.5, alignItems: 'center' }} key={key}>
                        {item.icon && <item.icon color={key == items.length - 1 ? theme.palette.text.primary : theme.palette.text.secondary} size={14} />}
                        <Typography variant="body2" color={key == items.length - 1 ? theme.palette.text.primary : theme.palette.text.secondary}>
                            {item.label}
                        </Typography>
                    </Link>
                ))}
            </MuiBreadcrumbs>
        </Stack>
    );
};