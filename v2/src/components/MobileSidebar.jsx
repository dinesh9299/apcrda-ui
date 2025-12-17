import { Drawer } from "antd";
import SidebarContent from "./SidebarContent";

export default function MobileSidebar({ open, onClose }) {
  return (
    <Drawer
      placement="left"
      open={open}
      onClose={onClose}
      closable={false}
      width={260}
      bodyStyle={{ padding: 0 }}
    >
      <SidebarContent onItemClick={onClose} />
    </Drawer>
  );
}
