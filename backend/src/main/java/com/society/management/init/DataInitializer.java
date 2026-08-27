package com.society.management.init;

import com.society.management.entity.*;
import com.society.management.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements CommandLineRunner {

    private final FlatRepository flatRepository;
    private final ResidentRepository residentRepository;
    private final MaintenanceRecordRepository maintenanceRecordRepository;
    private final PaymentRepository paymentRepository;
    private final ExpenseRepository expenseRepository;
    private final NoticeRepository noticeRepository;
    private final ComplaintRepository complaintRepository;
    private final SocietyRepository societyRepository;
    private final SocietySettingsRepository societySettingsRepository;
    private final ActivityRepository activityRepository;
    private final UserRepository userRepository;
    private final org.springframework.security.crypto.password.PasswordEncoder passwordEncoder;

    private static final String[] INDIAN_NAMES = {
            "Rahul Sharma", "Amit Patel", "Neha Shah", "Raj Mehta", "Priya Desai",
            "Karan Joshi", "Sneha Patel", "Vivek Shah", "Anjali Mehta", "Vikram Malhotra",
            "Pooja Iyer", "Manish Gupta", "Sanjay Verma", "Ritu Singhania", "Aditya Roy",
            "Deepak Chawla", "Meera Trivedi", "Harish Nambiar", "Swati Kulkarni", "Arjun Saxena",
            "Kavita Reddy", "Rohan Kapoor", "Shweta Bhatt", "Nitin Agrawal", "Sunita Rao",
            "Gaurav Jain", "Divya Nair", "Manoj Pandey", "Alka Deshmukh", "Pranav Vora",
            "Preeti Menon", "Kunal Merchant", "Tanvi Joshi", "Siddharth Dave", "Rupal Shah",
            "Ketan Soni", "Shruti Somani", "Dhaval Parikh", "Bhavna Chauhan", "Chirag Parekh",
            "Tarun Bansal", "Leena Mathew", "Ashish Goel", "Geeta Bhatia", "Sachin Pillai",
            "Nisha Agarwal", "Mayank Sinha", "Rashmi Tiwari", "Bhavesh Solanki", "Parul Thaker"
    };

    private static final Set<String> VACANT_FLATS = Set.of(
            "A-304", "B-203", "B-501", "C-104", "C-402",
            "D-301", "D-504", "E-202", "F-103", "F-404", "F-502", "E-503"
    );

    private static final Set<String> OVERDUE_FLATS = Set.of(
            "A-201", "A-403", "B-104", "B-302", "C-204", "C-503",
            "D-102", "D-401", "E-304", "F-201", "F-303"
    );

    private static final Set<String> TENANT_FLATS = Set.of(
            "A-102", "A-203", "A-401", "B-101", "B-304", "B-402",
            "C-101", "C-303", "C-502", "D-203", "D-404", "E-104",
            "E-301", "E-403", "F-102", "F-301", "F-402"
    );

    private static final String[] AVATAR_COLORS = {
            "bg-indigo-600", "bg-emerald-600", "bg-blue-600", "bg-purple-600",
            "bg-amber-600", "bg-rose-600", "bg-teal-600", "bg-cyan-600"
    };

    @Override
    public void run(String... args) {
        // Seed Societies if none exist
//        if (societyRepository.count() == 0) {
//            seedSocieties();
//        }
//
//        // Seed Users if none exist
//        if (userRepository.count() == 0) {
//            seedUsers();
//        }
//
//        if (flatRepository.count() > 0) {
//            log.info("Database already seeded with flats. Skipping DataInitializer.");
//            return;
//        }

        log.info("Starting database seeding for Society Management System...");

        // 1. Seed Society Settings
//        seedSocietySettings();

        // 2. Seed Flats for both Green Valley and Royal Palm
//        seedFlats();

        // 3. Seed Residents
//        seedResidents();

        // 4. Seed Maintenance Records for August 2026
//        seedMaintenanceRecords();

        // 5. Seed Payments
//        seedPayments();

        // 6. Seed Expenses
//        seedExpenses();

        // 7. Seed Notices
//        seedNotices();

        // 8. Seed Complaints
//        seedComplaints();

        // 9. Seed Activities
//        seedActivities();

//        log.info("Database seeding completed successfully!");
    }

    private void seedSocieties() {
        log.info("Seeding SaaS platform registered societies...");
        List<Society> societies = List.of(
                Society.builder()
                        .id("soc-grv")
                        .name("Green Valley Residency")
                        .subdomain("greenvalley")
                        .registrationNumber("GRV/2020/123/GUJ")
                        .address("Plot 42, SG Highway, Bodakdev")
                        .city("Ahmedabad")
                        .state("Gujarat")
                        .pincode("380054")
                        .contactPhone("+91 79 2685 4100")
                        .contactEmail("office@greenvalleyresidency.in")
                        .totalFlats(120)
                        .totalBlocks(6)
                        .subscriptionPlan("GROWTH")
                        .subscriptionStatus("ACTIVE")
                        .monthlyCharge(1999.0)
                        .planExpiresAt("2027-08-25")
                        .active(true)
                        .build(),
                Society.builder()
                        .id("soc-rpm")
                        .name("Royal Palm Heights")
                        .subdomain("royalpalm")
                        .registrationNumber("RPM/2021/892/MAH")
                        .address("Survey 88, Baner-Pashan Link Road")
                        .city("Pune")
                        .state("Maharashtra")
                        .pincode("411045")
                        .contactPhone("+91 20 6688 9900")
                        .contactEmail("admin@royalpalmheights.in")
                        .totalFlats(80)
                        .totalBlocks(4)
                        .subscriptionPlan("ENTERPRISE")
                        .subscriptionStatus("ACTIVE")
                        .monthlyCharge(2999.0)
                        .planExpiresAt("2027-09-01")
                        .active(true)
                        .build(),
                Society.builder()
                        .id("soc-sky")
                        .name("Skyline Crest Towers")
                        .subdomain("skyline")
                        .registrationNumber("SKY/2023/451/KAR")
                        .address("Outer Ring Road, Bellandur")
                        .city("Bengaluru")
                        .state("Karnataka")
                        .pincode("560103")
                        .contactPhone("+91 80 4422 1100")
                        .contactEmail("society@skylinecrest.org")
                        .totalFlats(60)
                        .totalBlocks(3)
                        .subscriptionPlan("STARTER")
                        .subscriptionStatus("TRIAL")
                        .monthlyCharge(999.0)
                        .planExpiresAt("2026-09-10")
                        .active(true)
                        .build()
        );
        societyRepository.saveAll(societies);
    }

    private void seedUsers() {
        log.info("Seeding default authentication users...");
        List<User> users = List.of(
                User.builder()
                        .name("Platform Super Admin")
                        .email("superadmin@societysaas.com")
                        .phone("+91 99999 11111")
                        .password(passwordEncoder.encode("admin123"))
                        .role(Role.ROLE_SUPER_ADMIN)
                        .societyId("platform-root")
                        .active(true)
                        .build(),
                User.builder()
                        .name("Dr. Vikram Mehta")
                        .email("admin@greenvalleyresidency.in")
                        .phone("+91 98250 11223")
                        .password(passwordEncoder.encode("admin123"))
                        .role(Role.ROLE_ADMIN)
                        .societyId("soc-grv")
                        .flatNumber("C-501")
                        .active(true)
                        .build(),
                User.builder()
                        .name("Rahul Sharma")
                        .email("rahul.sharma@greenvalleyresidency.in")
                        .phone("+91 98765 43210")
                        .password(passwordEncoder.encode("resident123"))
                        .role(Role.ROLE_RESIDENT)
                        .societyId("soc-grv")
                        .flatNumber("A-101")
                        .active(true)
                        .build(),
                User.builder()
                        .name("Amit Patel")
                        .email("amit.patel@greenvalleyresidency.in")
                        .phone("+91 98980 12345")
                        .password(passwordEncoder.encode("resident123"))
                        .role(Role.ROLE_RESIDENT)
                        .societyId("soc-grv")
                        .flatNumber("A-204")
                        .active(true)
                        .build(),
                User.builder()
                        .name("Priya Desai")
                        .email("priya.desai@greenvalleyresidency.in")
                        .phone("+91 98240 99001")
                        .password(passwordEncoder.encode("resident123"))
                        .role(Role.ROLE_RESIDENT)
                        .societyId("soc-grv")
                        .flatNumber("E-402")
                        .active(true)
                        .build(),
                User.builder()
                        .name("Rajesh Kulkarni")
                        .email("admin@royalpalm.in")
                        .phone("+91 98220 55667")
                        .password(passwordEncoder.encode("admin123"))
                        .role(Role.ROLE_ADMIN)
                        .societyId("soc-rpm")
                        .flatNumber("A-101")
                        .active(true)
                        .build(),
                User.builder()
                        .name("Aditya Roy")
                        .email("aditya.roy@royalpalm.in")
                        .phone("+91 98220 88990")
                        .password(passwordEncoder.encode("resident123"))
                        .role(Role.ROLE_RESIDENT)
                        .societyId("soc-rpm")
                        .flatNumber("B-201")
                        .active(true)
                        .build()
        );
        userRepository.saveAll(users);
        log.info("Default users seeded with phone & role mapping successfully.");
    }

    private void seedSocietySettings() {
        SocietySettings settings = SocietySettings.builder()
                .id(1L)
                .name("Green Valley Residency")
                .subtitle("Cooperative Housing Society Ltd.")
                .registrationNumber("GRV/2020/123/GUJ")
                .address("Plot 42, SG Highway, Bodakdev")
                .city("Ahmedabad")
                .state("Gujarat")
                .pincode("380054")
                .contactPhone("+91 79 4002 8800")
                .contactEmail("admin@greenvalleyresidency.in")
                .totalFlats(120)
                .totalBlocks(6)
                .bankDetails(BankDetails.builder()
                        .accountName("Green Valley Residency CHS Maintenance A/C")
                        .accountNumber("50200084920194")
                        .bankName("HDFC Bank Ltd.")
                        .ifsc("HDFC0001024")
                        .branch("SG Highway Branch, Ahmedabad")
                        .upiId("greenvalleychs@hdfcbank")
                        .build())
                .maintenanceConfig(MaintenanceConfig.builder()
                        .defaultFlatRate(3500.0)
                        .sqFtRate(3.04)
                        .billingDayOfMonth(1)
                        .dueDayOfMonth(10)
                        .lateFeePerWeek(100.0)
                        .waterChargePerFlat(350.0)
                        .sinkingFundPercentage(10.0)
                        .build())
                .committeeMembers(List.of(
                        CommitteeMember.builder().role("Chairman / President").name("Dr. Vikram Mehta").flatNumber("C-501").phone("+91 98250 11223").email("vikram.mehta@greenvalleyresidency.in").build(),
                        CommitteeMember.builder().role("Hon. Secretary").name("Rahul Sharma").flatNumber("A-101").phone("+91 98765 43210").email("rahul.sharma@greenvalleyresidency.in").build(),
                        CommitteeMember.builder().role("Treasurer").name("Amit Patel").flatNumber("A-204").phone("+91 98980 33445").email("amit.patel@greenvalleyresidency.in").build()
                ))
                .build();
        societySettingsRepository.save(settings);
    }

    private void seedFlats() {
        List<Flat> flats = new ArrayList<>();
        String[] blocks = {"A", "B", "C", "D", "E", "F"};
        int nameIndex = 0;
        int parkingIndex = 1;

        // 1. Seed Green Valley Residency (soc-grv) Flats
        for (String block : blocks) {
            for (int floor = 1; floor <= 5; floor++) {
                for (int unit = 1; unit <= 4; unit++) {
                    String flatNumber = String.format("%s-%d0%d", block, floor, unit);
                    boolean isVacant = VACANT_FLATS.contains(flatNumber);
                    String bhk = (unit == 2) ? "3 BHK" : "2 BHK";
                    int areaSqFt = (unit == 2) ? 1450 : 1150;
                    double baseMaint = (unit == 2) ? 4200.0 : 3500.0;

                    String resName = isVacant ? null : INDIAN_NAMES[nameIndex % INDIAN_NAMES.length];
                    String phone = isVacant ? null : String.format("+91 98%03d %05d", (nameIndex * 17) % 900 + 100, (nameIndex * 31) % 90000 + 10000);
                    String email = isVacant ? null : resName.toLowerCase().replace(" ", ".") + "@greenvalleyresidency.in";
                    String occStatus = isVacant ? "Vacant" : "Occupied";
                    String ownType = isVacant ? "Vacant" : (TENANT_FLATS.contains(flatNumber) ? "Tenant" : "Owner");
                    String maintStatus = isVacant ? "N/A" : (OVERDUE_FLATS.contains(flatNumber) ? "Overdue" : "Paid");

                    if ("A-101".equals(flatNumber)) {
                        resName = "Rahul Sharma";
                        phone = "+91 98765 43210";
                        email = "rahul.sharma@greenvalleyresidency.in";
                        occStatus = "Occupied";
                        ownType = "Owner";
                        maintStatus = "Paid";
                    }

                    flats.add(Flat.builder()
                            .id("flat-soc-grv-" + flatNumber)
                            .societyId("soc-grv")
                            .flatNumber(flatNumber)
                            .block(block)
                            .floor(floor)
                            .bhk(bhk)
                            .areaSqFt(areaSqFt)
                            .occupancyStatus(occStatus)
                            .ownershipType(ownType)
                            .residentName(resName)
                            .residentPhone(phone)
                            .residentEmail(email)
                            .monthlyMaintenance(baseMaint)
                            .maintenanceStatus(maintStatus)
                            .parkingSlot("P-" + String.format("%02d", parkingIndex++))
                            .electricityMeter("ELEC-GRV-" + (floor * 100 + unit * 10))
                            .gasMeter("GAS-GRV-" + (floor * 100 + unit * 10))
                            .build());

                    if (!isVacant) nameIndex++;
                }
            }
        }

        // 2. Seed Royal Palm Heights (soc-rpm) Flats
        String[] rpmBlocks = {"A", "B", "C", "D"};
        int rpmParking = 1;
        int rpmNameIdx = 5;

        for (String block : rpmBlocks) {
            for (int floor = 1; floor <= 4; floor++) {
                for (int unit = 1; unit <= 4; unit++) {
                    String flatNumber = String.format("%s-%d0%d", block, floor, unit);
                    String resName = (unit == 1 && floor == 1) ? "Rajesh Kulkarni" : INDIAN_NAMES[rpmNameIdx % INDIAN_NAMES.length];
                    String phone = (unit == 1 && floor == 1) ? "+91 98220 55667" : String.format("+91 98220 %05d", 10000 + (rpmNameIdx * 73) % 89999);
                    String email = (unit == 1 && floor == 1) ? "admin@royalpalm.in" : resName.toLowerCase().replace(" ", ".") + "@royalpalm.in";

                    if ("B-201".equals(flatNumber)) {
                        resName = "Aditya Roy";
                        phone = "+91 98220 88990";
                        email = "aditya.roy@royalpalm.in";
                    }

                    flats.add(Flat.builder()
                            .id("flat-soc-rpm-" + flatNumber)
                            .societyId("soc-rpm")
                            .flatNumber(flatNumber)
                            .block(block)
                            .floor(floor)
                            .bhk(unit == 2 ? "3 BHK" : "2 BHK")
                            .areaSqFt(unit == 2 ? 1500 : 1200)
                            .occupancyStatus("Occupied")
                            .ownershipType("Owner")
                            .residentName(resName)
                            .residentPhone(phone)
                            .residentEmail(email)
                            .monthlyMaintenance(unit == 2 ? 4500.0 : 3800.0)
                            .maintenanceStatus("Paid")
                            .parkingSlot("RPM-P" + String.format("%02d", rpmParking++))
                            .electricityMeter("ELEC-RPM-" + (floor * 10 + unit))
                            .gasMeter("GAS-RPM-" + (floor * 10 + unit))
                            .build());

                    rpmNameIdx++;
                }
            }
        }

        flatRepository.saveAll(flats);
        log.info("Total {} flats seeded across societies.", flats.size());
    }

    private void seedResidents() {
        List<Resident> residents = new ArrayList<>();
        List<Flat> occupiedFlats = flatRepository.findByOccupancyStatus("Occupied");

        int i = 0;
        for (Flat flat : occupiedFlats) {
            i++;
            residents.add(Resident.builder()
                    .id("res-" + (flat.getSocietyId() != null ? flat.getSocietyId() + "-" : "") + flat.getFlatNumber())
                    .societyId(flat.getSocietyId())
                    .name(flat.getResidentName() != null ? flat.getResidentName() : "Resident")
                    .flatNumber(flat.getFlatNumber())
                    .block(flat.getBlock())
                    .phone(flat.getResidentPhone() != null ? flat.getResidentPhone() : "+91 98250 11223")
                    .alternatePhone("+91 98980 " + String.format("%05d", 10000 + (i * 123) % 89999))
                    .email(flat.getResidentEmail() != null ? flat.getResidentEmail() : "resident@gmail.com")
                    .ownership("Tenant".equalsIgnoreCase(flat.getOwnershipType()) ? "Tenant" : "Owner")
                    .memberCount((i % 3) + 2)
                    .maintenanceAmount(flat.getMonthlyMaintenance())
                    .status("Active")
                    .moveInDate("2024-01-15")
                    .avatarColor(AVATAR_COLORS[i % AVATAR_COLORS.length])
                    .build());
        }
        residentRepository.saveAll(residents);
        log.info("Total {} residents seeded across societies.", residents.size());
    }

    private void seedMaintenanceRecords() {
        List<MaintenanceRecord> records = new ArrayList<>();
        List<Flat> occupiedFlats = flatRepository.findByOccupancyStatus("Occupied");

        for (Flat flat : occupiedFlats) {
            double total = flat.getMonthlyMaintenance();
            double water = 350.0;
            double sinking = Math.round(total * 0.10);
            double parking = 250.0;
            double base = total - water - sinking - parking;
            String status = flat.getMaintenanceStatus() != null ? flat.getMaintenanceStatus() : "Paid";
            double paidAmount = "Paid".equalsIgnoreCase(status) ? total : 0.0;
            double balanceAmount = "Paid".equalsIgnoreCase(status) ? 0.0 : total;

            records.add(MaintenanceRecord.builder()
                    .id("maint-" + (flat.getSocietyId() != null ? flat.getSocietyId() + "-" : "") + "2026-08-" + flat.getFlatNumber())
                    .societyId(flat.getSocietyId())
                    .flatNumber(flat.getFlatNumber())
                    .residentName(flat.getResidentName() != null ? flat.getResidentName() : "Resident")
                    .month("August 2026")
                    .billingCycle("2026-08")
                    .baseAmount(base)
                    .waterCharges(water)
                    .sinkingFund(sinking)
                    .parkingCharges(parking)
                    .lateFee(0.0)
                    .totalAmount(total)
                    .paidAmount(paidAmount)
                    .balanceAmount(balanceAmount)
                    .dueDate("10 Aug 2026")
                    .status(status)
                    .paidDate("Paid".equalsIgnoreCase(status) ? "15 Aug 2026" : null)
                    .build());
        }
        maintenanceRecordRepository.saveAll(records);
    }

    private void seedPayments() {
        List<PaymentTransaction> payments = List.of(
                PaymentTransaction.builder()
                        .id("pay-00842")
                        .societyId("soc-grv")
                        .receiptNumber("REC-2026-00842")
                        .date("24 Aug 2026")
                        .timestamp("2026-08-24T10:30:00")
                        .residentName("Rahul Sharma")
                        .flatNumber("A-101")
                        .amount(3500.0)
                        .forMonth("August 2026 Maintenance")
                        .paymentMode("UPI")
                        .referenceId("UPI928374829102")
                        .status("Success")
                        .notes("Paid via PhonePe QR code")
                        .build(),
                PaymentTransaction.builder()
                        .id("pay-00841")
                        .societyId("soc-grv")
                        .receiptNumber("REC-2026-00841")
                        .date("23 Aug 2026")
                        .timestamp("2026-08-23T16:15:00")
                        .residentName("Priya Desai")
                        .flatNumber("E-402")
                        .amount(4200.0)
                        .forMonth("August 2026 Maintenance")
                        .paymentMode("Bank Transfer")
                        .referenceId("NEFT8492019482")
                        .bankName("ICICI Bank")
                        .status("Success")
                        .notes("Net banking IMPS transfer")
                        .build(),
                PaymentTransaction.builder()
                        .id("pay-rpm-001")
                        .societyId("soc-rpm")
                        .receiptNumber("REC-RPM-2026-001")
                        .date("22 Aug 2026")
                        .timestamp("2026-08-22T11:00:00")
                        .residentName("Aditya Roy")
                        .flatNumber("B-201")
                        .amount(3800.0)
                        .forMonth("August 2026 Maintenance")
                        .paymentMode("UPI")
                        .referenceId("UPI-RPM-99281")
                        .status("Success")
                        .notes("Paid via Google Pay")
                        .build()
        );
        paymentRepository.saveAll(payments);
    }

    private void seedExpenses() {
        List<Expense> expenses = List.of(
                // Green Valley Expenses
                Expense.builder().id("exp-101").societyId("soc-grv").date("24 Aug 2026").category("Electricity").description("Common Area & Pump House Electricity Bill").vendor("Torrent Power Ltd.").amount(18500.0).paymentMode("Bank Transfer").status("Paid").approvedBy("Amit Patel").build(),
                Expense.builder().id("exp-102").societyId("soc-grv").date("22 Aug 2026").category("Security").description("Monthly Security Guard Services (8 Guards)").vendor("SIS Security Ltd.").amount(56000.0).paymentMode("Bank Transfer").status("Paid").approvedBy("Dr. Vikram Mehta").build(),
                Expense.builder().id("exp-103").societyId("soc-grv").date("20 Aug 2026").category("Lift").description("Quarterly AMC for 6 Elevators").vendor("Johnson Lifts").amount(22500.0).paymentMode("Bank Transfer").status("Paid").approvedBy("Dr. Vikram Mehta").build(),

                // Royal Palm Heights Expenses
                Expense.builder().id("exp-rpm-01").societyId("soc-rpm").date("23 Aug 2026").category("Security").description("Royal Palm Security Guard Staff (6 Guards)").vendor("Pune Guard Force").amount(42000.0).paymentMode("Bank Transfer").status("Paid").approvedBy("Rajesh Kulkarni").build(),
                Expense.builder().id("exp-rpm-02").societyId("soc-rpm").date("21 Aug 2026").category("Water").description("Emergency Water Tanker Supply (4 Tankers)").vendor("Baner Pure Water").amount(9600.0).paymentMode("UPI").status("Paid").approvedBy("Rajesh Kulkarni").build(),
                Expense.builder().id("exp-rpm-03").societyId("soc-rpm").date("19 Aug 2026").category("Repairs").description("Swimming Pool Pump Motor Rewinding").vendor("AquaTech Pune").amount(7800.0).paymentMode("Bank Transfer").status("Paid").approvedBy("Rajesh Kulkarni").build()
        );
        expenseRepository.saveAll(expenses);
    }

    private void seedNotices() {
        List<Notice> notices = List.of(
                // Green Valley Notices
                Notice.builder().id("not-01").societyId("soc-grv").title("Water Supply Maintenance & Tank Cleaning").category("Maintenance").priority("Urgent").publishDate("24 Aug 2026").validTill("26 Aug 2026").content("Water supply will remain unavailable between 10 AM and 2 PM on Sunday due to scheduled overhead tank maintenance.").publishedBy("Society Office").isPinned(true).build(),
                Notice.builder().id("not-02").societyId("soc-grv").title("6th Annual General Meeting Notice").category("Meeting").priority("High").publishDate("22 Aug 2026").validTill("30 Aug 2026").content("Annual General Meeting of Green Valley Residency CHS will be held on Sunday at 10:00 AM.").publishedBy("Management Committee").isPinned(true).build(),

                // Royal Palm Notices
                Notice.builder().id("not-rpm-01").societyId("soc-rpm").title("Royal Palm Heights AGM & Solar Project Discussion").category("Meeting").priority("High").publishDate("23 Aug 2026").validTill("31 Aug 2026").content("All residents of Royal Palm Heights are invited to the clubhouse for discussing solar rooftop installation.").publishedBy("Hon. Secretary Rajesh Kulkarni").isPinned(true).build(),
                Notice.builder().id("not-rpm-02").societyId("soc-rpm").title("Swimming Pool Deep Cleaning Schedule").category("Maintenance").priority("Normal").publishDate("21 Aug 2026").validTill("25 Aug 2026").content("Swimming pool will remain closed on Wednesday for deep chlorination and filter replacement.").publishedBy("Facility Committee").isPinned(false).build()
        );
        noticeRepository.saveAll(notices);
    }

    private void seedComplaints() {
        List<Complaint> complaints = List.of(
                // Green Valley Complaint
                Complaint.builder().id("cmp-1024").societyId("soc-grv").ticketNumber("#CMP-1024").residentName("Rahul Sharma").flatNumber("A-101").phone("+91 98765 43210").category("Plumbing").title("Water leakage in master bathroom ceiling shaft").description("Noticeable seepage from upper floor.").date("24 Aug 2026").priority("High").status("In Progress").assignedTo("Manoj Plumber").timeline(new ArrayList<>(List.of(ComplaintTimelineItem.builder().date("24 Aug 2026 09:15 AM").status("Open").note("Complaint logged").build()))).build(),

                // Royal Palm Complaint
                Complaint.builder().id("cmp-rpm-01").societyId("soc-rpm").ticketNumber("#CMP-RPM-101").residentName("Aditya Roy").flatNumber("B-201").phone("+91 98220 88990").category("Electrical").title("Block B corridor light flickering").description("Corridor light on 2nd floor needs tube replacement.").date("23 Aug 2026").priority("Low").status("Open").assignedTo("Suresh Electrician").timeline(new ArrayList<>(List.of(ComplaintTimelineItem.builder().date("23 Aug 2026 10:00 AM").status("Open").note("Ticket raised by Aditya Roy").build()))).build()
        );
        complaintRepository.saveAll(complaints);
    }

    private void seedActivities() {
        List<ActivityItem> activities = List.of(
                ActivityItem.builder().id("act-101").societyId("soc-grv").title("Rahul Sharma paid ₹3,500").subtitle("Flat A-101 · August 2026 Maintenance via UPI").timestamp("2026-08-24T10:30:00").timeAgo("Just now").type("payment").iconColor("text-emerald-600 bg-emerald-100").build(),
                ActivityItem.builder().id("act-rpm-01").societyId("soc-rpm").title("Aditya Roy paid ₹3,800").subtitle("Flat B-201 · August 2026 Maintenance via UPI").timestamp("2026-08-24T09:00:00").timeAgo("1 hour ago").type("payment").iconColor("text-emerald-600 bg-emerald-100").build()
        );
        activityRepository.saveAll(activities);
    }
}
