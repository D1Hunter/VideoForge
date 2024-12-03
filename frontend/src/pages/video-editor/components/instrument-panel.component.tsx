import { IconButton, List, ListItem, ListItemButton, ListItemIcon, Stack, Tooltip } from "@mui/material";
import { FC } from "react";

interface InstrumentItem {
    icon: JSX.Element;
    onclick?: () => void;
}

interface InstrumentPanelProps {
    menuItems: InstrumentItem[];
}

const InstrumentPanel: FC<InstrumentPanelProps> = ({ menuItems }) => {
    return (
        <Stack spacing={2} justifyContent="center" alignItems="center">
            {menuItems.map((item, index) => (
                <Tooltip key={index} title={''} arrow>
                    <IconButton
                        onClick={item.onclick}
                        sx={{
                            width: 56,
                            height: 56,
                            borderRadius: '50%',
                            backgroundColor: 'primary.main',
                            color: 'white',
                            '&:hover': {
                                backgroundColor: 'primary.dark',
                            },
                        }}
                    >
                        {item.icon}
                    </IconButton>
                </Tooltip>
            ))}
        </Stack>
    );
};


export default InstrumentPanel;